package controllers

import (
    "net/http"
    "backend/config"
    "backend/models"
    "backend/untils"
     "fmt"
   
    "github.com/gin-gonic/gin"
)

// ✅ GET /classes
func GetClasses(c *gin.Context) {
    var classes []models.FitnessClass

    baseURL := "http://localhost:8080/uploads/class/"

    err := config.DB.Raw(`
        SELECT 
            class_id,
            name,
            description,
            class_type,
            time,
            day_of_week,
            created_by,
            created_at,
            updated_at,
            CASE 
                WHEN image_url IS NOT NULL AND image_url <> ''
                THEN ? || image_url
                ELSE NULL
            END AS image_url
        FROM fitnessclasses
        ORDER BY class_id ASC
    `, baseURL).Scan(&classes).Error

    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, classes)
}


// ✅ POST /classes
func CreateClass(c *gin.Context) {
    var input models.FitnessClass

    // Bind JSON
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // ดึง user_id จาก context
    userIDInterface, exists := c.Get("user_id")
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
        return
    }

    // แปลง float64 → uint
    userIDFloat, ok := userIDInterface.(float64)
    if !ok {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "invalid user_id type"})
        return
    }
    input.CreatedBy = uint(userIDFloat)

    // สร้างคลาส
    if err := config.DB.Create(&input).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    utils.SaveLog(
    c,
    "create",
    fmt.Sprintf("สร้างคลาสใหม่ %s id: %d", input.Name, input.ClassID),
)
    c.JSON(http.StatusCreated, input)
}


// ✅ PUT /classes/:id
func UpdateClass(c *gin.Context) {
    id := c.Param("id")
    var class models.FitnessClass

    // ตรวจสอบว่ามีคลาสนี้อยู่หรือไม่
    if err := config.DB.First(&class, "class_id = ?", id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{
            "error": "Class not found",
        })
        return
    }

    // รับข้อมูลใหม่จาก body
    var input models.FitnessClass
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "error":  "Invalid request body",
            "detail": err.Error(),
        })
        return
    }

    // อัปเดตข้อมูลเฉพาะ field ที่ส่งมา
    updatedData := map[string]interface{}{
        "name":        input.Name,
        "description": input.Description,
        "class_type":  input.ClassType,
        "time":        input.Time,
        "day_of_week": input.DayOfWeek,
        "updated_at":  input.UpdatedAt,
    }

    if err := config.DB.Model(&class).Updates(updatedData).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "error":  "Failed to update class",
            "detail": err.Error(),
        })
        return
    }
    utils.SaveLog(
    c,
    "update",
    fmt.Sprintf("อัปเดตคลาส %s id: %d", input.Name, input.ClassID),
)
    c.JSON(http.StatusOK, gin.H{
        "status": "success",
        "data":   class,
    })
}
// GET /classes/names
func GetUniqueClassNames(c *gin.Context) {
    var names []string
    // use config.DB (GORM) to fetch distinct class names
    if err := config.DB.Table("fitnessclasses").Distinct("name").Order("name ASC").Pluck("name", &names).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch class names", "detail": err.Error()})
        return
    }
    c.JSON(http.StatusOK, names)
}
func DeleteClass(c *gin.Context) {
    id := c.Param("id")

    var class models.FitnessClass
    // ตรวจสอบว่ามีคลาสนี้หรือไม่
    if err := config.DB.First(&class, "class_id = ?", id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{
            "error": "Class not found",
        })
        return
    }

    // ลบคลาสออกจากฐานข้อมูล
    if err := config.DB.Delete(&class).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "error":  "Failed to delete class",
            "detail": err.Error(),
        })
        return
    }
    utils.SaveLog(
    c,
    "delete",
    fmt.Sprintf("ลบคลาส %s id: %d", class.Name, class.ClassID),
)
    c.JSON(http.StatusOK, gin.H{
        "status":  "success",
        "message": "Class deleted successfully",
    })
}

