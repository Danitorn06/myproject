package controllers

import (
    "backend/config"
    "backend/models"
	"backend/untils"
    "github.com/gin-gonic/gin"
    "net/http"
	"fmt"
	"golang.org/x/crypto/bcrypt"
)

func GetUsers(c *gin.Context) {
	var users []models.User

	config.DB.
	Preload("Memberships").
	Preload("Memberships.Package").
	Preload("Memberships.MembershipInfo").
	//Preload("Memberships.HealthAnswers").
	Find(&users)

	c.JSON(http.StatusOK, gin.H{
		"data": users,
	})
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

func GetCurrentUser(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	var user models.User
	if err := config.DB.First(&user, "user_id = ?", userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	var membership models.Membership
	err := config.DB.
		Preload("Package"). // ✅ โหลดข้อมูล package
		Where("user_id = ? AND status = ?", userID, "active").
		Order("membership_id DESC").
		First(&membership).Error
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"user":       user,
			"membership": nil,
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"user":       user,
		"membership": membership,
	})
}
func UpdateUser(c *gin.Context) {
	id := c.Param("id")
	var user models.User

	// เช็คว่ามี user นี้อยู่ไหม
	if err := config.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// รับข้อมูลที่ต้องการแก้ไข
	var input models.User
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// อัปเดตข้อมูล
	if err := config.DB.Model(&user).Updates(input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
		return
	}
	utils.SaveLog(
		c,
		"update",
		fmt.Sprintf("อัปเดตข้อมูลผู้ใช้ id: %d", user.UserID),
	)
	c.JSON(http.StatusOK, gin.H{
		"message": "User updated successfully",
		"data":    user,
	})
}

type DeleteUserInput struct {
	Password string `json:"password" binding:"required"`
}

func DeleteUser(c *gin.Context) {
	id := c.Param("id")

	// 🔹 รับ password จาก body
	var input DeleteUserInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Password is required"})
		return
	}

	// 🔹 ดึง user ที่ login อยู่ (admin)
	adminID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var admin models.User
	if err := config.DB.First(&admin, "user_id = ?", adminID).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Admin not found"})
		return
	}

	// 🔹 เช็ครหัสผ่าน
	if err := bcrypt.CompareHashAndPassword(
		[]byte(admin.PasswordHash),
		[]byte(input.Password),
	); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect password"})
		return
	}

	// 🔹 หา user ที่จะลบ
	var user models.User
	if err := config.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// 🔹 ป้องกัน admin ลบตัวเอง
	if user.UserID == admin.UserID {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot delete your own account"})
		return
	}

	// 🔹 ลบ
	if err := config.DB.Delete(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user"})
		return
	}
	utils.SaveLog(
		c,
		"delete",
		fmt.Sprintf("ลบผู้ใช้ id: %d", user.UserID),
	)
	
	c.JSON(http.StatusOK, gin.H{
		"message": "User deleted successfully",
	})
}