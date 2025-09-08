package models

import "time"

type Membership struct {
    MembershipID uint      `gorm:"primaryKey" json:"membership_id"`
    UserID       uint      `json:"user_id"`
    PackageID    *uint     `json:"package_id"`
    StartDate    time.Time `json:"start_date"`
    EndDate      time.Time `json:"end_date"`
    Status       string    `json:"status"` // active, expired, cancelled
    CreatedAt    time.Time `json:"created_at"`
}