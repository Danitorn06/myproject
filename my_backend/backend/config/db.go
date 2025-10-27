package config

import (
	"fmt"
	"log"
	"os"

	"backend/models"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	_ = godotenv.Load()

	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	)

	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("❌ ไม่สามารถเชื่อมต่อฐานข้อมูลได้:", err)
	}

	// Auto migrate model ทั้งหมด
	err = database.AutoMigrate(
		&models.User{},
		&models.Package{},
		&models.Membership{},
		&models.FitnessClass{},
		&models.News{},
	)

	if err != nil {
		log.Fatal("❌ Migration ล้มเหลว:", err)
	}

	DB = database
	log.Println("✅ Database เชื่อมต่อและ migrate สำเร็จ")
}
func GetJWTSecret() []byte {
	return []byte(os.Getenv("JWT_SECRET"))
}