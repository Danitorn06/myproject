package controllers

import (
	"net/http"
	"backend/config"
	"backend/models"
	"github.com/gin-gonic/gin"
	"time"				
)	
func CreateVisit(c *gin.Context) {

	id := c.Param("id")

	// =============================
	// 1️⃣ เช็คว่าสมาชิก active
	// =============================
	var membership models.Membership
	if err := config.DB.
		Where("membership_id = ? AND status = ?", id, "active").
		First(&membership).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Membership not active",
		})
		return
	}

	// =============================
	// 2️⃣ เช็คว่าเข้าแล้ววันนี้หรือยัง
	// =============================
	var existing models.FitnessVisit

	err := config.DB.
		Where("membership_id = ? AND DATE(visit_date) = CURRENT_DATE", membership.MembershipID).
		First(&existing).Error

	if err == nil {
		// ถ้าเจอ record = เข้าแล้ววันนี้
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Already checked in today",
		})
		return
	}

	// =============================
	// 3️⃣ บันทึกการเข้า
	// =============================
	visit := models.FitnessVisit{
		MembershipID: membership.MembershipID,
		VisitDate:    time.Now(),
	}

	if err := config.DB.Create(&visit).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to record visit",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Visit recorded successfully",
	})
}
func GetVisitByMember(c *gin.Context) {

	id := c.Param("id")

	var visits []models.FitnessVisit

	config.DB.
		Where("membership_id = ?", id).
		Order("visit_date DESC").
		Find(&visits)

	c.JSON(http.StatusOK, gin.H{
		"data": visits,
	})
}
func GetAllVisits(c *gin.Context) {

	var visits []models.FitnessVisit

	config.DB.
		Preload("Membership").
		Preload("Membership.User").
		Order("visit_date DESC").
		Find(&visits)

	c.JSON(http.StatusOK, gin.H{
		"data": visits,
	})
}