package controllers

import (
    "backend/config"
    "backend/models"
    "github.com/gin-gonic/gin"
    "net/http"
    "gorm.io/gorm"
)

func GetAllNews(c *gin.Context) {
    var news []models.News
    if err := config.DB.Order("publish_date DESC").Find(&news).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, news)
}
func GetNewsByID(c *gin.Context) {
    id := c.Param("id") // ดึงพารามิเตอร์จาก URL
    var news models.News

    if err := config.DB.First(&news, id).Error; err != nil {
        if err == gorm.ErrRecordNotFound {
            c.JSON(http.StatusNotFound, gin.H{"error": "News not found"})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        }
        return
    }

    c.JSON(http.StatusOK, news)
}
func CreateNews(c *gin.Context) {
    var news models.News

    if err := c.ShouldBindJSON(&news); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    if err := config.DB.Create(&news).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, news)
}
