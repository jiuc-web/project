import api from './api';

export const fetchTasks = () => api.get('/tasks');
export const createTask = (task) => api.post('/tasks', task);
export const updateTask = (id, task) => api.put(`/tasks/${id}`, task);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
export const uploadResource = (taskId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post(`/tasks/${taskId}/resources`, formData);
};