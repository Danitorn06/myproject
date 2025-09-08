package controllers

import (
    "net/http"
    "backend/config"
    "backend/models"

    "github.com/gin-gonic/gin"
)

func GetPackages(c *gin.Context) {
    var packages []models.Package
    config.DB.Find(&packages)
    c.JSON(http.StatusOK, packages)
}

func CreatePackage(c *gin.Context) {
    var pack models.Package
    if err := c.ShouldBindJSON(&pack); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    config.DB.Create(&pack)
    c.JSON(http.StatusCreated, pack)
}