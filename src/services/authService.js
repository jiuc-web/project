import request from '../utils/request';

// 登录（identifier 可以是用户名或邮箱）
export const login = (identifier, password) =>
  request.post('/login', { identifier, password });

// 注册（增加 email 参数）
export const register = (username, password, email) =>
  request.post('/register', { username, password, email });