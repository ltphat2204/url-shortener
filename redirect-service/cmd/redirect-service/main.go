package main

import (
	"log"

	"github.com/ltphat2204/url-shortener/redirect-service/controllers"
	"github.com/ltphat2204/url-shortener/redirect-service/routes"
	"github.com/ltphat2204/url-shortener/redirect-service/services"

	"github.com/gin-gonic/gin"
)

func main() {
	redisClient := services.NewRedisClient()
	cacheService := services.NewCacheService(redisClient)

	urlService := services.NewURLService(cacheService)
	urlController := controllers.NewURLController(urlService)

	r := gin.Default()
	routes.SetupRoutes(r, urlController)

	log.Println("Redirect service starting on :8080")
	r.Run(":8080")
}
