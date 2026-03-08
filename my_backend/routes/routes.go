package routes

import (
	"backend/controllers"
	"backend/middleware"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	api := r.Group("/api/v1")

	{
		// ✅ Public routes (ไม่ต้อง login)
		auth := api.Group("/auth")
		{
			auth.POST("/register", controllers.Register)
			auth.POST("/login", controllers.Login)
			auth.POST("/logout", controllers.Logout)
		}

		news := api.Group("/news")
		{
			news.GET("", controllers.GetAllNews)
			news.GET("/:id", controllers.GetNewsByID)
		}

		class := api.Group("/classes")
		{
			class.GET("", controllers.GetClasses)
			class.GET("/names", controllers.GetUniqueClassNames)
		}
		packages := api.Group("/packages")
		{
			packages.GET("", controllers.GetPackages)
		}
		// 🔒 Protected routes (ต้อง login)
		protected := api.Group("/")
		protected.Use(middleware.AuthMiddleware())
		//protected.Use(middleware.UserLogMiddleware())  // ✅ log ทุก request
		{
			// 👤 User routes
			user := protected.Group("/users")
			{
				user.GET("/me", controllers.GetCurrentUser)
			}
			membership := protected.Group("/membership")
			membership.Use(middleware.RequireRoles("user"))
			{
				membership.GET("", controllers.GetMemberships)
				membership.POST("", controllers.CreateMembership)
			}
			membershipInfo := protected.Group("/membership-info")
            membershipInfo.Use(middleware.RequireRoles("user"))
			{
				membershipInfo.POST("", controllers.CreateMembershipInfo)
				membershipInfo.PUT("/:id", controllers.UpdateMembershipInfo)
				membershipInfo.DELETE("/:id", controllers.DeleteMembershipInfo)
			}

			health := protected.Group("/health-answer")
            health.Use(middleware.RequireRoles("user"))
			{
				health.POST("", controllers.CreateHealthAnswer)
				//health.PUT("/:id", controllers.UpdateHealthAnswer)
				//health.DELETE("/:id", controllers.DeleteHealthAnswer)
			}

			// 📰 News (เฉพาะ admin)
			newsAdmin := protected.Group("/news")
			newsAdmin.Use(middleware.RequireRoles("admin"))
			{
				newsAdmin.POST("", controllers.CreateNews)
				newsAdmin.PUT("/:id", controllers.UpdateNews) // ✅ update
				newsAdmin.DELETE("/:id", controllers.DeleteNews)
			}
			admin := protected.Group("/admin")
			admin.Use(middleware.RequireRoles("admin"))
			{
				admin.GET("/users", controllers.GetUsers)
				admin.GET("/users/:id", controllers.GetUserByID)
				admin.PUT("/users/:id", controllers.UpdateUser)
				admin.DELETE("/users/:id", controllers.DeleteUser)
			}

			// 🏋️‍♂️ Classes (admin, fitness_staff)
			classAdmin := protected.Group("/classes")
			classAdmin.Use(middleware.RequireRoles("admin"))
			{
				classAdmin.POST("", controllers.CreateClass)
				classAdmin.PUT("/:id", controllers.UpdateClass)
				classAdmin.DELETE("/:id", controllers.DeleteClass)
			}
			packagesAdmin := protected.Group("/packages")
			packagesAdmin.Use(middleware.RequireRoles("admin"))
			{
				packagesAdmin.POST("", controllers.CreatePackage)
				packagesAdmin.PUT("/:id", controllers.UpdatePackage)
				packagesAdmin.DELETE("/:id", controllers.DeletePackage)
			}
			// 💳 Memberships (เฉพาะ admin)
			membershipAdmin := protected.Group("/memberships")
			membershipAdmin.Use(middleware.RequireRoles("admin"))
			{
				membershipAdmin.GET("", controllers.GetAllMemberMemberships)

				// ✅ อนุมัติ
				membershipAdmin.PATCH("/:id/approve", controllers.ApproveMembership)

				// ❌ reject
				membershipAdmin.PATCH("/:id/reject", controllers.RejectMembership)

				membershipAdmin.DELETE("/:id", controllers.DeleteMembership)
			}
			adminvisit := protected.Group("/admin")
			adminvisit.Use(middleware.RequireRoles("admin"))
			{
				adminvisit.GET("/visits", controllers.GetAllVisits)
				adminvisit.GET("/visits/:id", controllers.GetVisitByMember)
				adminvisit.POST("/visits/:id", controllers.CreateVisit)
			}	

			adminlog := protected.Group("/admin")
			adminlog.Use(middleware.RequireRoles("admin"))
			{
				adminlog.GET("/logs", controllers.GetUserLogs)
			}
			adminDashboard := protected.Group("/admin")
			adminDashboard.Use(middleware.RequireRoles("admin"))
			{
				adminDashboard.GET("/dashboard-summary", controllers.GetDashboardSummary)
				adminDashboard.GET("/user-type", controllers.GetUserByType)
				adminDashboard.GET("/dashboard/members", controllers.GetMembershipStats)
				adminDashboard.GET("/dashboard/visits", controllers.GetVisitStats)
			}		



		}
	}
}
