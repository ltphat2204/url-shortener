package controllers

import (
	"net/http"
	"strings"

	"github.com/ltphat2204/url-shortener/redirect-service/services"

	"github.com/gin-gonic/gin"
)

type URLController struct {
	urlService services.URLService
}

func NewURLController(urlService services.URLService) *URLController {
	return &URLController{
		urlService: urlService,
	}
}

// RedirectHandler handles GET /{short} - redirects to destination URL
func (c *URLController) RedirectHandler(ctx *gin.Context) {
	shortCode := ctx.Param("short")

	// Validate short code
	if shortCode == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Short code is required",
		})
		return
	}

	// Clean the short code (remove any trailing slashes or special characters)
	shortCode = strings.TrimSpace(shortCode)

	// Get destination URL from URL service
	destinationURL, err := c.urlService.GetDestinationURL(shortCode)
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			ctx.JSON(http.StatusNotFound, gin.H{
				"error": "Short URL not found",
			})
			return
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch URL information",
		})
		return
	}

	// Validate destination URL
	if destinationURL == "" {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Invalid destination URL",
		})
		return
	}

	// Add protocol if missing
	if !strings.HasPrefix(destinationURL, "http://") && !strings.HasPrefix(destinationURL, "https://") {
		destinationURL = "https://" + destinationURL
	}

	// Redirect to destination URL
	ctx.Redirect(http.StatusMovedPermanently, destinationURL)
}

// HealthCheckHandler handles health check
func (c *URLController) HealthCheckHandler(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{
		"status":  "ok",
		"service": "redirect-service",
	})
}

