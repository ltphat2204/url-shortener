package config

import (
	"os"
	"strconv"
	"time"
	"log"
	"github.com/joho/godotenv"
)

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Note: .env file not found, using environment variables from system")
	}
}

func GetURLServiceBaseURL() string {
	if url := os.Getenv("URL_SERVICE_BASE_URL"); url != "" {
		return url
	}

	return "http://localhost:8081" // Default URL service endpoint
}

func GetRedisAddr() string {
	if addr := os.Getenv("REDIS_ADDR"); addr != "" {
		return addr
	}
	return "localhost:6379" // Default Redis address
}

func GetRedisPassword() string {
	return os.Getenv("REDIS_PASSWORD") // Default is empty string
}

func GetRedisDB() int {
	if dbStr := os.Getenv("REDIS_DB"); dbStr != "" {
		if db, err := strconv.Atoi(dbStr); err == nil {
			return db
		}
	}
	return 0 // Default Redis DB
}

func GetCacheTTL() time.Duration {
	ttlStr := os.Getenv("CACHE_TTL_SECONDS")
	if ttl, err := strconv.Atoi(ttlStr); err == nil && ttl > 0 {
		return time.Duration(ttl) * time.Second
	}
	return 5 * time.Minute // Default cache expiration
}