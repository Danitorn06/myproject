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
func GetMembershipStats(c *gin.Context) {

	type Result struct {
		Period string `json:"period"`
		Total  int64  `json:"total"`
	}

	groupType := c.DefaultQuery("type", "daily")

	var results []Result
	query := config.DB.Model(&models.Membership{}).
		Where("status = ?", "active")

	switch groupType {

	case "daily":
		query.Select("DATE(created_at) as period, COUNT(*) as total").
			Group("DATE(created_at)")

	case "monthly":
		query.Select("TO_CHAR(created_at, 'YYYY-MM') as period, COUNT(*) as total").
			Group("TO_CHAR(created_at, 'YYYY-MM')")

	case "yearly":
		query.Select("TO_CHAR(created_at, 'YYYY') as period, COUNT(*) as total").
			Group("TO_CHAR(created_at, 'YYYY')")
	}

	query.Order("period ASC").Scan(&results)

	c.JSON(http.StatusOK, gin.H{
		"data": results,
	})
}

// =======================
// VISIT STATS (Monthly/Yearly)
// =======================
func GetVisitStats(c *gin.Context) {

	type Result struct {
		Period string `json:"period"`
		Total  int64  `json:"total"`
	}

	groupType := c.DefaultQuery("type", "daily")

	var results []Result
	query := config.DB.Model(&models.FitnessVisit{})

	switch groupType {

	case "daily":
		query.Select("DATE(visit_date) as period, COUNT(*) as total").
			Group("DATE(visit_date)")

	case "monthly":
		query.Select("TO_CHAR(visit_date, 'YYYY-MM') as period, COUNT(*) as total").
			Group("TO_CHAR(visit_date, 'YYYY-MM')")

	case "yearly":
		query.Select("TO_CHAR(visit_date, 'YYYY') as period, COUNT(*) as total").
			Group("TO_CHAR(visit_date, 'YYYY')")
	}

	query.Order("period ASC").Scan(&results)

	c.JSON(http.StatusOK, gin.H{
		"data": results,
	})
}