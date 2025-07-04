package routes

import (
	"backend/internal/controllers"
	"backend/internal/middleware"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRoutes(router *gin.Engine, db *gorm.DB, jwtSecret string) {
	// 初始化控制器
	authController := controllers.NewAuthController(db, jwtSecret)
	taskController := controllers.NewTaskController(db)
	settingController := controllers.NewSettingController(db)

	// 公共路由组 - 不需要认证
	public := router.Group("/api")
	{
		public.POST("/register", authController.Register)
		public.POST("/login", authController.Login)
	}

	// 私有路由组 - 需要认证
	private := router.Group("/api")
	private.Use(middleware.AuthMiddleware(jwtSecret))
	{
		// 用户相关路由
		private.GET("/profile", authController.GetUserProfile)
		private.PUT("/profile", authController.UpdateUserProfile)
		private.POST("/profile/avatar", authController.UploadAvatar)

		// 任务相关路由
		private.GET("/tasks", taskController.GetTasks)
		private.POST("/tasks", taskController.CreateTask)
		private.PUT("/tasks/:id", taskController.UpdateTask)
		private.DELETE("/tasks/:id", taskController.DeleteTask)
		private.POST("/tasks/:id/resources", taskController.UploadTaskResource)

		// 设置相关路由
		private.GET("/settings", settingController.GetUserSettings)
		private.PUT("/settings", settingController.UpdateUserSettings)
		private.POST("/settings/background", settingController.UploadBackgroundImage)
	}
}
