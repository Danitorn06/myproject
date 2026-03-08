package models

type FitnessClass struct {
    ClassID     uint   `gorm:"primaryKey" json:"class_id"`
    Name        string `json:"name"`
    Description string `json:"description"`
    ClassType   string `json:"class_type"` // Cardio, Strength, Flexibility
    Instructor  string `json:"instructor"`
    ImageURL    string `json:"image_url"`
    Time        string `json:"time"`
    DayOfWeek   string `json:"day_of_week"`
    CreatedBy   uint   `json:"created_by"`
    CreatedAt   string `json:"created_at"`
    UpdatedAt   string `json:"updated_at"`
}
func (FitnessClass) TableName() string {
    return "fitnessclasses"
}
