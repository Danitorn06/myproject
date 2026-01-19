package controllers

import (
	"backend/config"
	"backend/models"
	"net/http"
	"strconv"


	"github.com/gin-gonic/gin"
)

// GET /admin/logs
func GetUserLogs(c *gin.Context) {
	var logs []models.UserLog

	// query params
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	role := c.Query("role")     // admin / user
	action := c.Query("action") // login, delete, update
	userID := c.Query("user_id")

	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 20
	}

	offset := (page - 1) * limit

	db := config.DB.Model(&models.UserLog{})

	// filters
	if role != "" {
		db = db.Where("role = ?", role)
	}
	if action != "" {
		db = db.Where("action = ?", action)
	}
	if userID != "" {
		db = db.Where("user_id = ?", userID)
	}

	var total int64
	db.Count(&total)

	if err := db.
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&logs).Error; err != nil {
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
	//fmt.Printf("CTX KEYS: %#v\n", c.Keys)

}
