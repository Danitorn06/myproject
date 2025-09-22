package controllers

import (
    "net/http"
    "backend/config"
    "backend/models"

    "github.com/gin-gonic/gin"
)

func GetMemberships(c *gin.Context) {
    var memberships []models.Membership
    config.DB.Find(&memberships)
    c.JSON(http.StatusOK, memberships)
}

func CreateMembership(c *gin.Context) {
    var membership models.Membership

    // รับค่า JSON จาก request body
    if err := c.ShouldBindJSON(&membership); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // บันทึกลงฐานข้อมูล
    if err := config.DB.Create(&membership).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    // ตอบกลับเมื่อสร้างเสร็จ
    c.JSON(http.StatusCreated, gin.H{
        "status":  "success",
        "message": "Membership created successfully",
        "data":    membership,
    })
}