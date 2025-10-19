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
        }
        packages := api.Group("/packages")
            {
                packages.GET("", controllers.GetPackages)
            }
        // 🔒 Protected routes (ต้อง login)
        protected := api.Group("/")
        protected.Use(middleware.AuthMiddleware())
        {
            // 👤 User routes
            user := protected.Group("/users")
            {
                user.GET("", controllers.GetUsers)
            }

            // 📰 News (เฉพาะ admin)
            newsAdmin := protected.Group("/news")
            newsAdmin.Use(middleware.AuthMiddleware())
            {
                news.POST("", controllers.CreateNews)
                news.PUT("/:id", controllers.UpdateNews)     // ✅ update
                news.DELETE("/:id", controllers.DeleteNews)
            }

            // 🏋️‍♂️ Classes (admin, fitness_staff)
            classAdmin := protected.Group("/classes")
            classAdmin.Use(middleware.RequireRoles("admin", "fitness_staff"))
            {
                classAdmin.POST("", controllers.CreateClass)
            }

            // 💳 Memberships (เฉพาะ admin)
            membership := protected.Group("/memberships")
            membership.Use(middleware.RequireRoles("admin"))
            {
                membership.GET("", controllers.GetMemberships)
                membership.POST("", controllers.CreateMembership)
            }

            // 📦 Packages (เฉพาะ admin)
            /*packages := protected.Group("/packages")
            packages.Use(middleware.RequireRoles("admin"))
            {
                packages.GET("", controllers.GetPackages)
                packages.POST("", controllers.CreatePackage)
            }*/
        }
    }
}
