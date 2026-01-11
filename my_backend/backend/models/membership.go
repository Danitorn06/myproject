package models

import "time"

type Membership struct {
	MembershipID uint `gorm:"primaryKey" json:"membership_id"`

	MembershipNo uint `json:"membership_no"`
	UserID       uint `json:"user_id"`
	PackageID    uint `json:"package_id"`

	StartDate time.Time `json:"start_date"`
	EndDate   time.Time `json:"end_date"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"created_at"`

	User    *User    `gorm:"foreignKey:UserID" json:"user"`
	Package *Package `gorm:"foreignKey:PackageID" json:"package"`
}

