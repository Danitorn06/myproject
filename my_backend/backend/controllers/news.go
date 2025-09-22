package controllers

import (
    "backend/config"
    "backend/models"
    "net/http"

    "github.com/gin-gonic/gin"
    "gorm.io/gorm"
)

// ✅ GetAllNews
func GetAllNews(c *gin.Context) {
    var news []models.News
    if err := config.DB.Order("publish_date DESC").Find(&news).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, news)
}

// ✅ GetNewsByID
func GetNewsByID(c *gin.Context) {
    id := c.Param("id")
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

// ✅ CreateNews
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

// ✅ UpdateNews
func UpdateNews(c *gin.Context) {
    id := c.Param("id")
    var news models.News

    // หา record ก่อน
    if err := config.DB.First(&news, id).Error; err != nil {
        if err == gorm.ErrRecordNotFound {
            c.JSON(http.StatusNotFound, gin.H{"error": "News not found"})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        }
        return
    }

    var input models.News
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // อัปเดต
    if err := config.DB.Model(&news).Updates(input).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, news)
}

// ✅ DeleteNews
func DeleteNews(c *gin.Context) {
    id := c.Param("id")
    var news models.News

    if err := config.DB.First(&news, id).Error; err != nil {
        if err == gorm.ErrRecordNotFound {
            c.JSON(http.StatusNotFound, gin.H{"error": "News not found"})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        }
        return
    }

    if err := config.DB.Delete(&news).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"status": "deleted"})
}
