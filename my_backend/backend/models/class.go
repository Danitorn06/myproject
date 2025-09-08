package models

import "time"

type FitnessClass struct {
    ClassID     uint      `gorm:"primaryKey" json:"class_id"`
    Name        string    `json:"name"`
    Description string    `json:"description"`
    ClassType   string    `json:"class_type"` // Cardio, Strength, Flexibility
    Time        string    `json:"time"`
    DayOfWeek   string    `json:"day_of_week"`
    CreatedBy   uint      `json:"created_by"`
    CreatedAt   time.Time `json:"created_at"`
    UpdatedAt   time.Time `json:"updated_at"`
}
func (FitnessClass) TableName() string {
    return "fitnessclasses"
}
