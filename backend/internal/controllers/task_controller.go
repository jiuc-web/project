package controllers

import (
	"net/http"
	"time"

	"backend/internal/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type TaskController struct {
	DB *gorm.DB
}

func NewTaskController(db *gorm.DB) *TaskController {
	return &TaskController{DB: db}
}

type CreateTaskRequest struct {
	Title       string    `json:"title" binding:"required"`
	Description string    `json:"description"`
	DueDate     time.Time `json:"dueDate"` // 新增
}

// CreateTask 创建新任务
func (tc *TaskController) CreateTask(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var req CreateTaskRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"msg": "参数错误"})
		return
	}

	// 根据截止日期设置颜色
	colorCode := getColorCodeByDueDate(req.DueDate) // 修改这里

	task := models.Task{
		UserID:      userID.(uint),
		Title:       req.Title,
		Description: req.Description,
		DueDate:     req.DueDate, // 使用前端传递的截止日期
		Priority:    0,
		ColorCode:   colorCode,
		Status:      "pending",
	}

	if err := tc.DB.Create(&task).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create task"})
		return
	}

	c.JSON(http.StatusCreated, task)
}

// GetTasks 获取用户所有任务
func (tc *TaskController) GetTasks(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var tasks []models.Task
	if err := tc.DB.Where("user_id = ?", userID).Find(&tasks).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch tasks"})
		return
	}

	c.JSON(http.StatusOK, tasks)
}

// UpdateTask 更新任务
func (tc *TaskController) UpdateTask(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	taskID := c.Param("id")

	var taskInput struct {
		Title       string    `json:"title"`
		Description string    `json:"description"`
		DueDate     time.Time `json:"dueDate"`
		Priority    int       `json:"priority"`
		Status      string    `json:"status"`
	}

	if err := c.ShouldBindJSON(&taskInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var task models.Task
	if err := tc.DB.Where("id = ? AND user_id = ?", taskID, userID).First(&task).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	// 更新任务字段
	if taskInput.Title != "" {
		task.Title = taskInput.Title
	}
	if taskInput.Description != "" {
		task.Description = taskInput.Description
	}
	if !taskInput.DueDate.IsZero() {
		task.DueDate = taskInput.DueDate
		task.ColorCode = getColorCodeByDueDate(taskInput.DueDate)
	}
	if taskInput.Status != "" {
		task.Status = taskInput.Status
	}
	task.Priority = taskInput.Priority

	if err := tc.DB.Save(&task).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update task"})
		return
	}

	c.JSON(http.StatusOK, task)
}

// DeleteTask 删除任务
func (tc *TaskController) DeleteTask(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	taskID := c.Param("id")

	if err := tc.DB.Where("id = ? AND user_id = ?", taskID, userID).Delete(&models.Task{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete task"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Task deleted successfully"})
}

// UploadTaskResource 上传任务相关资料
func (tc *TaskController) UploadTaskResource(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	taskID := c.Param("id")

	// 验证任务是否存在且属于该用户
	var task models.Task
	if err := tc.DB.Where("id = ? AND user_id = ?", taskID, userID).First(&task).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File is required"})
		return
	}

	// 在实际应用中，应该将文件保存到安全的存储位置
	filePath := "uploads/" + file.Filename
	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	resource := models.TaskResource{
		TaskID:   task.ID,
		FileName: file.Filename,
		FilePath: filePath,
		FileSize: file.Size,
	}

	if err := tc.DB.Create(&resource).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save resource"})
		return
	}

	c.JSON(http.StatusCreated, resource)
}

// getColorCodeByDueDate 根据截止日期返回颜色代码
func getColorCodeByDueDate(dueDate time.Time) string {
	now := time.Now()
	diff := dueDate.Sub(now)

	if diff < 24*time.Hour {
		return "#ff6b6b" // 红色 - 紧急
	} else if diff < 7*24*time.Hour {
		return "#feca57" // 橙色 - 一周内到期
	} else {
		return "#1dd1a1" // 绿色 - 还有时间
	}
}
