package controllers

import (
	"backend/config"
	"backend/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
)

// รับค่า email + password
type LoginInput struct {
	Login    string `json:"login" binding:"required"` // ✅ username/email ช่องเดียว
	Password string `json:"password" binding:"required"`
}


// รับค่าสำหรับ register
type RegisterInput struct {
	Username string `json:"username" binding:"required"`
	FullName string `json:"full_name"`
	Email    string `json:"email" binding:"required,email"`
	Phone    string `json:"phone"`
	Password string `json:"password" binding:"required"`
	Role     string `json:"role"`
}

// Login
func Login(c *gin.Context) {
	var input struct {
		Login    string `json:"login" binding:"required"` // รับได้ทั้ง username หรือ email
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User

	// 🔎 ค้นผู้ใช้จาก username หรือ email
	if err := config.DB.
		Where("username = ?", input.Login).
		Or("email = ?", input.Login).
		First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid username/email or password"})
		return
	}

	// 🔐 ตรวจสอบรหัสผ่าน
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(input.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid username/email or password"})
		return
	}

	// 🧾 สร้าง JWT
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id":  user.UserID,
		"username": user.Username,
		"role":     user.Role,
		"exp":      time.Now().Add(24 * time.Hour).Unix(),
		"iat":      time.Now().Unix(),
	})

	tokenString, err := token.SignedString(config.GetJWTSecret())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not generate token"})
		return
	}

	// 🍪 Set cookie (dev localhost)
	c.SetCookie("token", tokenString, 3600*24, "/", "localhost", false, true)

	// ✅ Response
	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "login successful",
		"user": gin.H{
			"id":        user.UserID,
			"username":  user.Username,
			"full_name": user.FullName,
			"email":     user.Email,
			"phone":     user.Phone,
			"role":      user.Role,
			"qr_code":   user.QRCodePath,
		},
		"token": tokenString,
	})
}



// Logout
func Logout(c *gin.Context) {
	c.SetCookie("token", "", -1, "/", "localhost", false, true)

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "logout successful",
	})
}

// Register
func Register(c *gin.Context) {
	var input RegisterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Hash password
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)

	user := models.User{
		Username:     input.Username,
		FullName:     input.FullName,
		Email:        input.Email,
		Phone:        input.Phone,
		PasswordHash: string(hashedPassword),
		Role:         input.Role,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	if err := config.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"status": "success",
		"user": gin.H{
			"id":        user.UserID,
			"username":  user.Username,
			"full_name": user.FullName,
			"email":     user.Email,
			"phone":     user.Phone,
			"role":      user.Role,
			"qr_code":   user.QRCodePath,
		},
	})
}

// Profile (ตัวอย่าง Protected Route)
func Profile(c *gin.Context) {
	userID, _ := c.Get("user_id")
	username, _ := c.Get("username")
	role, _ := c.Get("role")

	c.JSON(http.StatusOK, gin.H{
		"user_id":  userID,
		"username": username,
		"role":     role,
	})
}
