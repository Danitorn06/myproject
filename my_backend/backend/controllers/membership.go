package controllers

import (
	"backend/config"
	"backend/models"
	"net/http"
	"time"


	"github.com/gin-gonic/gin"
)


func GetMemberships(c *gin.Context) {
	var memberships []models.Membership
	config.DB.Preload("Package").Preload("User").Find(&memberships)
	c.JSON(http.StatusOK, memberships)
}

func CreateMembership(c *gin.Context) {

	// 1️⃣ ดึง user_id จาก JWT
	userIDAny, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	userID := uint(userIDAny.(float64))

	// 2️⃣ รับ package_id
	var req struct {
		PackageID uint `json:"package_id" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 3️⃣ ตรวจสอบ package
	var pkg models.Package
	if err := config.DB.First(&pkg, req.PackageID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "package not found"})
		return
	}

	now := time.Now()

	// 4️⃣ เช็ก membership active ล่าสุด
	var activeMembership models.Membership
	err := config.DB.
		Where("user_id = ? AND status = ?", userID, "active").
		Order("membership_id DESC").
		First(&activeMembership).Error

	// 👉 ถ้ามี active และยังไม่หมดอายุ = ห้ามสร้าง
	if err == nil && activeMembership.EndDate.After(now) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "you already have an active membership",
			"end_date": activeMembership.EndDate,
		})
		return
	}

	// 👉 ถ้ามี active แต่หมดอายุแล้ว → ปิดสถานะ
	if err == nil && activeMembership.EndDate.Before(now) {
		config.DB.Model(&activeMembership).
			Update("status", "expired")
	}

	// 5️⃣ หา membership_no ใหม่
	var lastNo uint
	config.DB.Model(&models.Membership{}).
		Where("user_id = ?", userID).
		Select("COALESCE(MAX(membership_no), 0)").
		Scan(&lastNo)

	newMembershipNo := lastNo + 1

	// 6️⃣ สร้าง membership ใหม่
	startDate := now
	endDate := startDate.AddDate(0, 1, 0) // 1 เดือน (ปรับได้)

	membership := models.Membership{
		UserID:       userID,
		MembershipNo: newMembershipNo,
		PackageID:    pkg.PackageID,
		StartDate:    startDate,
		EndDate:      endDate,
		Status:       "active",
		CreatedAt:    now,
	}

	if err := config.DB.Create(&membership).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// 7️⃣ response
	c.JSON(http.StatusCreated, gin.H{
		"status": "success",
		"data": gin.H{
			"membership_id": membership.MembershipID,
			"membership_no": membership.MembershipNo,
			"package_id":    membership.PackageID,
			"start_date":    membership.StartDate,
			"end_date":      membership.EndDate,
			"status":        membership.Status,
		},
	})
}
