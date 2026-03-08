package main

import (
    "backend/config"
    "backend/routes"
    "github.com/gin-gonic/gin"
    "github.com/gin-contrib/cors"
    "time" 
)

func main() {
    r := gin.Default()

    r.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:3000"},
        AllowMethods:     []string{"GET", "POST", "PUT","PATCH", "DELETE", "OPTIONS"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
        MaxAge: 12 * time.Hour,
    }))
    r.Static("/uploads", "./uploads")
    config.ConnectDatabase()
    routes.SetupRoutes(r)
    r.Run(":8080")
}