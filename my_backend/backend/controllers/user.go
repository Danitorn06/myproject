package controllers

import (
    "backend/config"
    "backend/models"
    "github.com/gin-gonic/gin"
    "net/http"
)

func GetUsers(c *gin.Context) {
    var users []models.User
    config.DB.Find(&users)
    c.JSON(http.StatusOK, users)
}

func GetUserByID(c *gin.Context) {
    id := c.Param("id")
    var user models.User
    if err := config.DB.First(&user, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        return
    }
    c.JSON(http.StatusOK, user)
}
func GetCurrentUser(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var user models.User
	// เปลี่ยนจาก id → user_id
	if err := config.DB.First(&user, "user_id = ?", userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	var membership models.Membership
	if err := config.DB.Where("user_id = ?", userID).First(&membership).Error; err != nil {
		membership = models.Membership{}
	}

	c.JSON(http.StatusOK, gin.H{
		"user":       user,
		"membership": membership,
	})
}

