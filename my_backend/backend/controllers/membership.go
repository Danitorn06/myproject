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
    if err := c.ShouldBindJSON(&membership); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    config.DB.Create(&membership)
    c.JSON(http.StatusCreated, membership)
}