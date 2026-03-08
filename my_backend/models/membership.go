package models

import "time"

type Membership struct {
	MembershipID uint `gorm:"primaryKey" json:"membership_id"`

	MembershipNo string `json:"membership_no"`
	UserID       uint `json:"user_id"`
	PackageID    uint `json:"package_id"`

	StartDate time.Time `json:"start_date"`
	EndDate   time.Time `json:"end_date"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"created_at"`

	User    User    `gorm:"foreignKey:UserID;references:UserID" json:"user"`
	Package Package `gorm:"foreignKey:PackageID;references:PackageID" json:"package"`
	MembershipInfo MembershipInfo `gorm:"foreignKey:MembershipID;references:MembershipID" json:"membership_info"`
	HealthAnswer   []HealthAnswer `gorm:"foreignKey:MembershipID;references:MembershipID" json:"health_answers"`
	
}
