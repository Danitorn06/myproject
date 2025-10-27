package models

import "time"

type News struct {
    NewsID      uint      `gorm:"primaryKey" json:"news_id"`
    Title       string    `json:"title"`
    Content     string    `json:"content"`
    ImageURL    string    `json:"image_url"`
    Type        string    `json:"type"` // general / health
    PublishDate time.Time `json:"publish_date"`
    CreatedBy   uint      `json:"created_by"`
    CreatedAt   time.Time `json:"created_at"`
    UpdatedAt   time.Time `json:"updated_at"`

}
