package routes

import (
    "backend/controllers"
    "github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
    api := r.Group("/api/v1")
    {
        auth := api.Group("/auth")
        {
            auth.POST("/register", controllers.Register)
            auth.POST("/login", controllers.Login)
        }
        user := api.Group("/users")
        {
            user.GET("", controllers.GetUsers)
        }

        news := api.Group("/news")
        {
            news.GET("", controllers.GetAllNews)
            news.POST("", controllers.CreateNews)
            news.GET("/:id", controllers.GetNewsByID)
        }

        class := api.Group("/classes")
        {
            class.GET("", controllers.GetClasses)
            class.POST("", controllers.CreateClass)
        }

        membership := api.Group("/memberships")
        {
            membership.GET("", controllers.GetMemberships)
            membership.POST("", controllers.CreateMembership)
        }

        packages := api.Group("/packages")
        {
            packages.GET("", controllers.GetPackages)
            packages.POST("", controllers.CreatePackage)
        }
    }
}
