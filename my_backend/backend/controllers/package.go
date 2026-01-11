package controllers

import (
    "net/http"
    "strconv"

    "backend/config"
    "backend/models"

    "github.com/gin-gonic/gin"
)

// ✅ ดึงข้อมูลแพ็กเกจทั้งหมด
func GetPackages(c *gin.Context) {
    var packages []models.Package
    config.DB.Order("package_id ASC").Find(&packages)
    c.JSON(http.StatusOK, packages)
}

// ✅ เพิ่มแพ็กเกจใหม่
func CreatePackage(c *gin.Context) {
    var pack models.Package
    if err := c.ShouldBindJSON(&pack); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    if result := config.DB.Create(&pack); result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        return
    }

    c.JSON(http.StatusCreated, pack)
}

// ✅ แก้ไขแพ็กเกจตาม ID
func UpdatePackage(c *gin.Context) {
    id := c.Param("id")
    var pack models.Package

    // ตรวจสอบว่ามีอยู่จริงไหม
    if result := config.DB.First(&pack, id); result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบแพ็กเกจนี้"})
        return
    }

    // รับข้อมูลใหม่
    var input models.Package
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // ✅ อัปเดตเฉพาะฟิลด์ที่ส่งมา (ป้องกันการรีเซ็ตค่าอื่น)
    if input.Price != 0 {
        pack.Price = input.Price
    }
    if input.Duration != 0 {
        pack.Duration = input.Duration
    }
    if input.UserType != "" {
        pack.UserType = input.UserType
    }

    if result := config.DB.Save(&pack); result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        return
    }

    c.JSON(http.StatusOK, pack)
}

// ✅ ลบแพ็กเกจตาม ID
func DeletePackage(c *gin.Context) {
    id := c.Param("id")

    idInt, err := strconv.Atoi(id)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "ID ไม่ถูกต้อง"})
        return
    }

    result := config.DB.Delete(&models.Package{}, idInt)
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        return
    }

    if result.RowsAffected == 0 {
        c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบแพ็กเกจนี้"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "ลบแพ็กเกจเรียบร้อยแล้ว"})
}
