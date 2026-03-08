package models

type Package struct {
    PackageID uint    `gorm:"primaryKey" json:"package_id"`
    UserType  string  `json:"user_type"` // student, university_staff, external
    Duration   int `json:"duration"`  
    Price     float64 `json:"price"`
}

type Packages struct {
	PackageID   uint    `gorm:"primaryKey" json:"package_id"`
	PackageName string  `json:"package_name"` // ⭐ frontend ใช้
	UserType    string  `json:"user_type"`
	Duration    int     `json:"duration"` // จำนวนวัน
	Price       float64 `json:"price"`
}
