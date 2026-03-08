package models

import "time"

type MembershipInfo struct {
	InfoID       uint `json:"info_id" gorm:"primaryKey;column:info_id"`
	MembershipID uint `json:"membership_id" gorm:"column:membership_id;unique;not null"`

	FullName  string     `json:"full_name" gorm:"size:100;not null"`
	Gender    string     `json:"gender" gorm:"size:10"`
	BirthDate *time.Time `json:"birth_date" gorm:"type:date" time_format:"2006-01-02"`
	Phone     string     `json:"phone" gorm:"size:20"`
	Email     string     `json:"email" gorm:"size:100"`
	LineID    string     `json:"line_id" gorm:"size:100"`

	UserType  string `json:"user_type" gorm:"size:30"`
	Faculty   string `json:"faculty" gorm:"size:100"`
	Major     string `json:"major" gorm:"size:100"`
	StudentID string `json:"student_id" gorm:"size:50"`

	Department string `json:"department" gorm:"size:100"`

	EmergencyName  string `json:"emergency_name" gorm:"size:100"`
	EmergencyPhone string `json:"emergency_phone" gorm:"size:20"`

	KnownFrom string `json:"known_from" gorm:"size:100"`

	CreatedAt time.Time `json:"created_at" gorm:"column:created_at"`
}

func (MembershipInfo) TableName() string {
	return "membership_info"
}
