package main

import (
	"log"
	"os"

	"backend/internal/config"
	"backend/internal/models"
	"backend/internal/routes"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlserver"
	"gorm.io/gorm"
)

func main() {
	// 加载配置
	cfg := config.LoadConfig()

	// 初始化数据库
	dsn := "sqlserver://" + cfg.DBUser + ":" + cfg.DBPassword + "@" + cfg.DBHost + ":" + cfg.DBPort + "?database=" + cfg.DBName
	db, err := gorm.Open(sqlserver.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// 自动迁移表结构
	err = db.AutoMigrate(
		&models.User{},
		&models.Task{},
		&models.TaskResource{},
		&models.UserSetting{},
	)
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	log.Println("数据库迁移成功！") // 增加提示

	// 设置Gin模式
	if os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	// 初始化Gin
	router := gin.Default()

	// 设置路由
	routes.SetupRoutes(router, db, cfg.JWTSecret)

	// 启动服务器
	log.Printf("Server is running on port %s", cfg.ServerPort)
	if err := router.Run(":" + cfg.ServerPort); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
