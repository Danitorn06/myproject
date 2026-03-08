// models/user_log.go
package models

import "time"

type UserLog struct {
    LogID       uint      `gorm:"primaryKey" json:"log_id"`
    UserID      *uint     `json:"user_id"`
    Role        string    `json:"role"`
    Action      string    `json:"action"`
    Description string    `json:"description"`
    IPAddress   string    `json:"ip_address"`
    UserAgent   string    `json:"user_agent"`
    CreatedAt   time.Time `json:"created_at"`
}
func (UserLog) TableName() string {
	return "user_logs"
}