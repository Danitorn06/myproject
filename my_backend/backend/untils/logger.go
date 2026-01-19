package utils

import (
	"backend/config"
	"backend/models"
	"time"

	"github.com/gin-gonic/gin"
)

func SaveLog(c *gin.Context, action, description string) {

	var userID *uint
	var role string

	// ----- user_id -----
	if uidRaw, exists := c.Get("user_id"); exists && uidRaw != nil {
		switch v := uidRaw.(type) {
		case float64:
			u := uint(v)
			userID = &u
		case int:
			u := uint(v)
			userID = &u
		case uint:
			u := v
			userID = &u
		}
	}

	// ----- role -----
	if roleRaw, exists := c.Get("role"); exists && roleRaw != nil {
		if r, ok := roleRaw.(string); ok {
			role = r
		}
	}

	if role == "" {
		role = "guest"
	}

	log := models.UserLog{
		UserID:      userID,
		Role:        role,
		Action:      action,
		Description: description,
		IPAddress:   c.ClientIP(),
		UserAgent:   c.GetHeader("User-Agent"),
		CreatedAt:   time.Now(),
	}

	if err := config.DB.Create(&log).Error; err != nil {
		println("SAVE LOG ERROR:", err.Error())
	}
}
