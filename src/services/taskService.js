import request from '../utils/request';

// 获取任务列表
export const fetchTasks = () => request.get('/tasks');

// 新建任务（参数顺序：标题、描述、截止日期）
export const createTask = (title, description, dueDate) =>
  request.post('/tasks', { title, description, dueDate });

// 更新任务
export const updateTask = (id, task) => request.put(`/tasks/${id}`, task);

// 删除任务
export const deleteTask = (id) => request.delete(`/tasks/${id}`);