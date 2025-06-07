package models

import "time"

type URLResponse struct {
	ShortURLID     string    `json:"short_url_id"`
	Title          string    `json:"title"`
	Description    *string   `json:"description,omitempty"`
	ShortCode      string    `json:"short_code"`
	DestinationURL string    `json:"destination_url"`
	UserID         uint      `json:"user_id"`
	CreatedAt      time.Time `json:"created_at"`
}

type APIResponse struct {
	Data    *URLResponse `json:"data,omitempty"`
	Error   string       `json:"error,omitempty"`
	Message string       `json:"message,omitempty"`
}