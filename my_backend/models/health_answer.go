package models

import "time"

type HealthAnswer struct {
	HealthID     uint `gorm:"primaryKey;column:health_id"`
	MembershipID uint `gorm:"column:membership_id;unique;not null"`

	Q1 bool
	Q2 bool
	Q3 bool
	Q4 bool
	Q5 bool
	Q6 bool
	Q7 bool

	CreatedAt time.Time `gorm:"column:created_at"`


}

func (HealthAnswer) TableName() string {
	return "health_answers"
}
