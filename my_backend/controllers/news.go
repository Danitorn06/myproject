package controllers

import (
    "backend/config"
    "backend/models"
    "net/http"
    "os"
    "time"
    "fmt"
    "backend/untils"

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
    title := c.PostForm("title")
    content := c.PostForm("content")
    newsType := c.PostForm("type")
    publishDateStr := c.PostForm("publish_date")

    publishDate, _ := time.Parse(time.RFC3339, publishDateStr)

    // 🔐 user id
    userIDInterface, _ := c.Get("user_id")
    userID := uint(userIDInterface.(float64))

    // 📷 upload image
    file, err := c.FormFile("image")
    imageURL := ""

    if err == nil {
        filename := fmt.Sprintf("%d_%s", time.Now().Unix(), file.Filename)
        path := "uploads/news/" + filename
        os.MkdirAll("uploads/news", os.ModePerm)
        c.SaveUploadedFile(file, path)
        imageURL = "http://localhost:8080/" + path
    }

    news := models.News{
        Title:       title,
        Content:     content,
        ImageURL:    imageURL,
        Type:        newsType,
        PublishDate: publishDate,
        CreatedBy:   userID,
    }

    if err := config.DB.Create(&news).Error; err != nil {
        c.JSON(500, gin.H{"error": err.Error()})
        return
    }
    utils.SaveLog(
	c,
	"create",
	fmt.Sprintf("สร้างข่าวใหม่ %s id: %d", news.Title, news.NewsID),
)

    c.JSON(http.StatusOK, news)
}

// ✅ UpdateNews
func UpdateNews(c *gin.Context) {
    id := c.Param("id")
    var news models.News

    if err := config.DB.First(&news, id).Error; err != nil {
        c.JSON(404, gin.H{"error": "not found"})
        return
    }

    news.Title = c.PostForm("title")
    news.Content = c.PostForm("content")
    news.Type = c.PostForm("type")

    file, err := c.FormFile("image")
    if err == nil {
        filename := fmt.Sprintf("%d_%s", time.Now().Unix(), file.Filename)
        path := "uploads/news/" + filename
        os.MkdirAll("uploads/news", os.ModePerm)
        c.SaveUploadedFile(file, path)
        news.ImageURL = "http://localhost:8080/" + path
    }

    config.DB.Save(&news)
    utils.SaveLog(
	c,
	"update",
	fmt.Sprintf("อัปเดตข่าว %s id: %d", news.Title, news.NewsID),
    )
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
    utils.SaveLog(
    c,
    "delete",
    fmt.Sprintf("ลบข่าว %s id: %d", news.Title, news.NewsID),
    )
    c.JSON(http.StatusOK, gin.H{"status": "deleted"})
}
