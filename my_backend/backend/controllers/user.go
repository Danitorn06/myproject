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
