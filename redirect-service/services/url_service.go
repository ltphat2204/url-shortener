package services

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"

	"github.com/ltphat2204/url-shortener/redirect-service/config"
	"github.com/ltphat2204/url-shortener/redirect-service/models"
	 
	"github.com/redis/go-redis/v9"
)

type URLService interface {
	GetDestinationURL(shortCode string) (string, error)
	GetURLInfo(shortCode string) (*models.URLResponse, error)
	DeleteURLFromCache(shortCode string) error
}

type urlService struct {
	httpClient *http.Client
	baseURL    string
	cache      CacheService
	cacheTTL   time.Duration
}

func NewURLService(cache CacheService) URLService {
	return &urlService{
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
		},
		baseURL:  config.GetURLServiceBaseURL(),
		cache:    cache,
		cacheTTL: config.GetCacheTTL(),
	}
}

func (s *urlService) GetDestinationURL(shortCode string) (string, error) {
	urlInfo, err := s.GetURLInfo(shortCode)
	if err != nil {
		return "", err
	}
	return urlInfo.DestinationURL, nil
}

func (s *urlService) GetURLInfo(shortCode string) (*models.URLResponse, error) {
	ctx := context.Background()
	cacheKey := fmt.Sprintf("urlinfo:%s", shortCode)

	// 1. Try to get from cache first
	cachedData, err := s.cache.Get(ctx, cacheKey)
	if err == nil {
		// Cache hit!
		log.Printf("Cache hit for short code: %s", shortCode)
		var urlInfo models.URLResponse
		if err := json.Unmarshal([]byte(cachedData), &urlInfo); err != nil {
			return nil, fmt.Errorf("failed to parse cached data: %w", err)
		}
		return &urlInfo, nil
	}

	// Handle cache errors (e.g., connection issue vs. not found)
	if !errors.Is(err, redis.Nil) {
		log.Printf("Redis error for key %s: %v. Proceeding to fetch from service.", cacheKey, err)
	} else {
		log.Printf("Cache miss for short code: %s", shortCode)
	}

	// 2. Cache miss, so fetch from the downstream service
	urlInfo, err := s.fetchURLInfoFromService(shortCode)
	if err != nil {
		return nil, err // Return the error from the service
	}

	// 3. Store the result in the cache for future requests
	jsonData, err := json.Marshal(urlInfo)
	if err != nil {
		log.Printf("Failed to marshal URL info for caching: %v", err)
		// Don't block the request, just return the data
		return urlInfo, nil
	}

	if err := s.cache.Set(ctx, cacheKey, jsonData, s.cacheTTL); err != nil {
		// Log the caching error but don't fail the request
		log.Printf("Failed to set cache for key %s: %v", cacheKey, err)
	}

	return urlInfo, nil
}

func (s *urlService) fetchURLInfoFromService(shortCode string) (*models.URLResponse, error) {
	log.Printf("Fetching from service for short code: %s", shortCode)
	url := fmt.Sprintf("%s/url/%s", s.baseURL, shortCode)

	resp, err := s.httpClient.Get(url)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch URL info: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		if resp.StatusCode == http.StatusNotFound {
			return nil, fmt.Errorf("short URL not found")
		}
		return nil, fmt.Errorf("URL service returned status %d: %s", resp.StatusCode, string(body))
	}

	var apiResponse models.APIResponse
	if err := json.Unmarshal(body, &apiResponse); err != nil {
		return nil, fmt.Errorf("failed to parse response JSON: %w", err)
	}

	if apiResponse.Error != "" {
		return nil, fmt.Errorf("URL service error: %s", apiResponse.Error)
	}

	if apiResponse.Data == nil {
		return nil, fmt.Errorf("no data returned from URL service")
	}

	return apiResponse.Data, nil
}

func (s *urlService) DeleteURLFromCache(shortCode string) error {
	ctx := context.Background()
	cacheKey := fmt.Sprintf("urlinfo:%s", shortCode)

	log.Printf("Attempting to delete cache for short code: %s (key: %s)", shortCode, cacheKey)
	return s.cache.Delete(ctx, cacheKey)
}