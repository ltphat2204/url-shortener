package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/ltphat2204/url-shortener/redirect-service/controllers"
)

func SetupRoutes(r *gin.Engine, urlController *controllers.URLController) {
	// Health check route
	r.GET("/health", urlController.HealthCheckHandler)

	// Redirect route
	r.GET("/:short", urlController.RedirectHandler)
}
