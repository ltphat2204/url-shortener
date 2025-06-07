package services

import (
	"context"
	"log"
	"time"

	"github.com/ltphat2204/url-shortener/redirect-service/config"

	"github.com/redis/go-redis/v9"
)

// CacheService defines the interface for a cache.
type CacheService interface {
	Get(ctx context.Context, key string) (string, error)
	Set(ctx context.Context, key string, value interface{}, expiration time.Duration) error
	Delete(ctx context.Context, key string) error
}

// redisCacheService is the Redis implementation of CacheService.
type redisCacheService struct {
	client *redis.Client
}

// NewRedisClient creates and returns a new Redis client.
func NewRedisClient() *redis.Client {
	rdb := redis.NewClient(&redis.Options{
		Addr:     config.GetRedisAddr(),
		Password: config.GetRedisPassword(),
		DB:       config.GetRedisDB(),
	})

	// Ping the server to check the connection
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if _, err := rdb.Ping(ctx).Result(); err != nil {
		log.Fatalf("Could not connect to Redis: %v", err)
	}

	log.Println("Successfully connected to Redis.")
	return rdb
}

// NewCacheService creates a new instance of our cache service.
func NewCacheService(client *redis.Client) CacheService {
	return &redisCacheService{
		client: client,
	}
}

// Get retrieves a value from the cache.
func (r *redisCacheService) Get(ctx context.Context, key string) (string, error) {
	return r.client.Get(ctx, key).Result()
}

// Set adds a value to the cache with an expiration.
func (r *redisCacheService) Set(ctx context.Context, key string, value interface{}, expiration time.Duration) error {
	return r.client.Set(ctx, key, value, expiration).Err()
}

// Delete removes a key from the cache.
func (r *redisCacheService) Delete(ctx context.Context, key string) error {
	// The Del command in go-redis returns the number of keys deleted.
	// We check the error to see if the command succeeded.
	return r.client.Del(ctx, key).Err()
}