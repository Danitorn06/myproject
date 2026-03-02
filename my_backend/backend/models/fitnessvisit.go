package models

import "time"

type FitnessVisit struct {
	ID           uint      `gorm:"primaryKey"`
	MembershipID uint      `json:"membership_id"`
	VisitDate    time.Time `json:"visit_date"`
	CreatedAt    time.Time `json:"created_at"`

	Membership Membership `gorm:"foreignKey:MembershipID;references:MembershipID"`
}