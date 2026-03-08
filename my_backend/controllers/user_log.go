package controllers

import (
	"backend/config"
	"net/http"
	"strconv"
	"time"


	"github.com/gin-gonic/gin"
)
type UserLogResponse struct {
	LogID       uint       `json:"log_id"`
	UserID      *uint      `json:"user_id"`
	Username    *string    `json:"username"`
	Role        string     `json:"role"`
	Action      string     `json:"action"`
	Description string     `json:"description"`
	IPAddress   string     `json:"ip_address"`
	UserAgent   string     `json:"user_agent"`
	CreatedAt   time.Time  `json:"created_at"`
}	

func GetUserLogs(c *gin.Context) {
	var logs []UserLogResponse

	// query params
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	role := c.Query("role")
	action := c.Query("action")
	userID := c.Query("user_id")

	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 20
	}

	offset := (page - 1) * limit

	db := config.DB.Table("user_logs ul").
		Select(`
			ul.log_id,
			ul.user_id,
			u.username,
			ul.role,
			ul.action,
			ul.description,
			ul.ip_address,
			ul.user_agent,
			ul.created_at
		`).
		Joins("LEFT JOIN users u ON u.user_id = ul.user_id")

	// filters
	if role != "" {
		db = db.Where("ul.role = ?", role)
	}
	if action != "" {
		db = db.Where("ul.action = ?", action)
	}
	if userID != "" {
		db = db.Where("ul.user_id = ?", userID)
	}

	var total int64
	db.Count(&total)

	if err := db.
		Order("ul.created_at DESC").
		Limit(limit).
		Offset(offset).
		Scan(&logs).Error; err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": logs,
		"pagination": gin.H{
			"page":  page,
			"limit": limit,
			"total": total,
		},
	})
}
