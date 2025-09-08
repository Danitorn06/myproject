package main

import (
    "backend/config"
    "backend/routes"
    "github.com/gin-gonic/gin"
    "github.com/gin-contrib/cors"
)

func main() {
    r := gin.Default()
     r.Use(cors.New(cors.Config{
        AllowOrigins: []string{"http://localhost:3000"},
        AllowMethods: []string{"GET","POST","PUT","DELETE"},
        AllowHeaders: []string{"Origin","Content-Type","Authorization"},
    }))

    config.ConnectDatabase()
    routes.SetupRoutes(r)
    r.Run(":8080")
}