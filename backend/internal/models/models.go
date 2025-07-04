package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username  string `gorm:"size:50;not null;unique"`
	Password  string `gorm:"size:255;not null"`
	Email     string `gorm:"size:100;not null;unique"`
	AvatarURL string `gorm:"size:255"`
}

type Task struct {
	gorm.Model
	UserID      uint   `gorm:"not null"`
	Title       string `gorm:"size:100;not null"`
	Description string `gorm:"type:text"`
	DueDate     time.Time
	Priority    int    `gorm:"default:0"`
	Status      string `gorm:"size:20;default:'pending'"`
	ColorCode   string `gorm:"size:20"`
	User        User   `gorm:"foreignKey:UserID"`
}

type TaskResource struct {
	gorm.Model
	TaskID   uint   `gorm:"not null"`
	FileName string `gorm:"size:255;not null"`
	FilePath string `gorm:"size:255;not null"`
	FileSize int64  `gorm:"not null"`
	Task     Task   `gorm:"foreignKey:TaskID"`
}

type UserSetting struct {
	gorm.Model
	UserID          uint   `gorm:"not null;unique"`
	FontFamily      string `gorm:"size:50;default:'Arial'"`
	FontSize        int    `gorm:"default:14"`
	BackgroundImage string `gorm:"size:255"`
	Theme           string `gorm:"size:20;default:'light'"`
	User            User   `gorm:"foreignKey:UserID"`
}
