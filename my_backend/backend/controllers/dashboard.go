package controllers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"backend/config"
	"backend/models"
	"fmt"

)


// =======================
// SUMMARY
// =======================
func GetDashboardSummary(c *gin.Context) {

	var totalUsers int64
	var todayVisits int64

	// นับเฉพาะสมาชิกที่ Active
	config.DB.
		Model(&models.Membership{}).
		Where("status = ?", "active").
		Count(&totalUsers)

	today := time.Now().Format("2006-01-02")

	config.DB.
		Table("fitness_visits").
		Where("DATE(visit_date) = ?", today).
		Count(&todayVisits)

	c.JSON(http.StatusOK, gin.H{
		"totalUsers": totalUsers,
		"todayVisits": todayVisits,
	})
}


// =======================
// USER BY TYPE (Pie)
// =======================
func GetUserByType(c *gin.Context) {

	type Result struct {
		Name  string `json:"name"`
		Value int    `json:"value"`
	}

	var results []Result

	err := config.DB.
		Table("memberships").
		Select("package_id as name, COUNT(*) as value").
		Where("status = ?", "active"). // ✅ เพิ่มตรงนี้
		Group("package_id").
		Scan(&results).Error

	if err != nil {
		fmt.Println("UserType Error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// แปลง package_id → ชื่อประเภท
	for i := range results {
		switch results[i].Name {
		case "1":
			results[i].Name = "นักเรียน/นักศึกษา"
		case "3":
			results[i].Name = "บุคลากรในมหาวิทยาลัย"
		case "5":
			results[i].Name = "บุคคลภายนอก"
		default:
			results[i].Name = "อื่น ๆ"
		}
	}

	c.JSON(http.StatusOK, gin.H{"data": results})
}
// =======================
// MEMBER STATS (Monthly/Yearly)
// =======================
func GetMemberStats(c *gin.Context) {

	statType := c.Query("type")

	type Result struct {
		Period string `json:"period"`
		Total  int    `json:"total"`
	}

	var results []Result

	if statType == "yearly" {
		config.DB.
			Table("memberships").
			Select("YEAR(created_at) as period, COUNT(*) as total").
			Group("YEAR(created_at)").
			Order("period ASC").
			Scan(&results)
	} else {
		config.DB.
			Table("memberships").
			Select("DATE_FORMAT(created_at, '%Y-%m') as period, COUNT(*) as total").
			Group("DATE_FORMAT(created_at, '%Y-%m')").
			Order("period ASC").
			Scan(&results)
	}

	c.JSON(http.StatusOK, gin.H{"data": results})
}


// =======================
// VISIT STATS (Monthly/Yearly)
// =======================
func GetVisitStats(c *gin.Context) {

	statType := c.Query("type")

	type Result struct {
		Period string `json:"period"`
		Total  int    `json:"total"`
	}

	var results []Result

	if statType == "yearly" {
		config.DB.
			Table("fitness_visits").
			Select("YEAR(visit_date) as period, COUNT(*) as total").
			Group("YEAR(visit_date)").
			Order("period ASC").
			Scan(&results)
	} else {
		config.DB.
			Table("fitness_visits").
			Select("DATE_FORMAT(visit_date, '%Y-%m') as period, COUNT(*) as total").
			Group("DATE_FORMAT(visit_date, '%Y-%m')").
			Order("period ASC").
			Scan(&results)
	}

	c.JSON(http.StatusOK, gin.H{"data": results})
}