package utils

import (
    "time"

    "github.com/golang-jwt/jwt/v5"
)

var jwtKey = []byte("my_secret_key") // ✅ แนะนำเก็บใน ENV

func GenerateToken(userID uint, email, role string) (string, error) {
    claims := jwt.MapClaims{
        "user_id": userID,
        "email":   email,
        "role":    role, // ✅ เพิ่ม role ลงไปใน claims
        "exp":     time.Now().Add(24 * time.Hour).Unix(),
        "iat":     time.Now().Unix(), // ออก token เวลาไหน
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString(jwtKey)
}
