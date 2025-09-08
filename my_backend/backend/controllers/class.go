package controllers

import (
    "net/http"
    "backend/config"
    "backend/models"

    "github.com/gin-gonic/gin"
)

func GetClasses(c *gin.Context) {
    var classes []models.FitnessClass

    result := config.DB.Raw(`
        SELECT class_id, name, description, class_type, time, day_of_week, created_by, created_at, updated_at 
        FROM fitnessclasses 
        ORDER BY class_id ASC
    `).Scan(&classes)

    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        return
    }

    c.JSON(http.StatusOK, classes)
}

// ✅ POST /classes
func CreateClass(c *gin.Context) {
    var class models.FitnessClass

    // bind JSON → struct
    if err := c.ShouldBindJSON(&class); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "error":  "Invalid request body",
            "detail": err.Error(),
        })
        return
    }

    // insert into DB
    if err := config.DB.Create(&class).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "error":  "Failed to create class",
            "detail": err.Error(),
        })
        return
    }

    c.JSON(http.StatusCreated, gin.H{
        "status": "success",
        "data":   class,
    })
}
