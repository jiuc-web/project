import axios from 'axios';

const instance = axios.create({
  baseURL: '/api', // 后端API地址
  timeout: 5000,
});

// 请求拦截器：自动加token
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default instance;