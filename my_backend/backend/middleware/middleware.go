package middleware

import (
    "net/http"
    "strings"
    "time"

    "github.com/gin-gonic/gin"
    "github.com/golang-jwt/jwt/v4"
)

var jwtSecret = []byte("your-secret-key")

func AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        // ✅ เปลี่ยนจาก jwt → token
        tokenString, err := c.Cookie("token")
        if err != nil || tokenString == "" {
            // backup จาก header
            authHeader := c.GetHeader("Authorization")
            if strings.HasPrefix(authHeader, "Bearer ") {
                tokenString = strings.TrimPrefix(authHeader, "Bearer ")
            }
        }

        if tokenString == "" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "missing token"})
            c.Abort()
            return
        }

        token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
            return jwtSecret, nil
        })

        if err != nil || token == nil || !token.Valid {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
            c.Abort()
            return
        }

        claims, ok := token.Claims.(jwt.MapClaims)
        if !ok {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid claims"})
            c.Abort()
            return
        }

        if exp, ok := claims["exp"].(float64); ok {
            if time.Now().Unix() > int64(exp) {
                c.JSON(http.StatusUnauthorized, gin.H{"error": "token expired"})
                c.Abort()
                return
            }
        }

        // ✅ set ค่าให้ใช้งานได้
        c.Set("user_id", claims["user_id"])
        c.Set("role", claims["role"])
        c.Next()
    }
}

func RequireRoles(roles ...string) gin.HandlerFunc {
    return func(c *gin.Context) {
        role, exists := c.Get("role")
        if !exists {
            c.JSON(http.StatusForbidden, gin.H{"error": "no role in token"})
            c.Abort()
            return
        }

        userRole := role.(string)
        for _, r := range roles {
            if userRole == r {
                c.Next()
                return
            }
        }

        c.JSON(http.StatusForbidden, gin.H{"error": "access denied"})
        c.Abort()
    }
}
