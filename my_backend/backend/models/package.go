package models

type Package struct {
    PackageID uint    `gorm:"primaryKey" json:"package_id"`
    UserType  string  `json:"user_type"` // student, university_staff, external
    Duration  string  `json:"duration"`  // one-time, monthly, 4-month
    Price     float64 `json:"price"`
}
