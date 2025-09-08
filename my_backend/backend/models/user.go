package models

import "time"

type User struct {
    UserID       uint      `gorm:"primaryKey" json:"user_id"`
    Username     string    `gorm:"unique" json:"username"`
    FullName     string    `json:"full_name"`
    Email        string    `gorm:"unique" json:"email"`
    Phone        string    `json:"phone"`
    PasswordHash string    `json:"-"`
    Role        string    `json:"role"`
    QRCodePath   string    `json:"qr_code_path"`
    CreatedAt    time.Time `json:"created_at"`
    UpdatedAt    time.Time `json:"updated_at"`
}
