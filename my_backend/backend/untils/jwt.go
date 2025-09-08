package utils

import (
    "time"

    "github.com/golang-jwt/jwt/v5"
)

var jwtKey = []byte("my_secret_key") // ควรเอาไปเก็บใน ENV

func GenerateToken(userID uint, email string) (string, error) {
    claims := &jwt.MapClaims{
        "user_id": userID,
        "email":   email,
        "exp":     time.Now().Add(24 * time.Hour).Unix(),
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString(jwtKey)
}
