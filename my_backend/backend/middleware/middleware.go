package middleware

import (
    "net/http"
    "strings"
    "github.com/gin-gonic/gin"
    "github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte("your-secret-key")

// AuthMiddleware ตรวจสอบว่า Login แล้วหรือยัง
func AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header missing"})
            c.Abort()
            return
        }

        tokenString := strings.TrimPrefix(authHeader, "Bearer ")
        token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
            return jwtSecret, nil
        })

        if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
            c.Set("user_id", claims["user_id"])
            c.Set("role", claims["role"])
            c.Next()
        } else {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token", "details": err.Error()})
            c.Abort()
            return
        }
    }
}
