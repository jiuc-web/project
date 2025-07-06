import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login(identifier, password);
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        navigate('/');
      } else {
        alert(res.data.msg || res.data.error || '登录失败');
      }
    } catch (e) {
      alert('登录请求失败');
    }
  };

  return (
    <div>
      <h1>登录</h1>
      <form onSubmit={handleLogin}>
        <input
          placeholder="用户名或邮箱"
          value={identifier}
          onChange={e => setIdentifier(e.target.value)}
        />
        <input
          type="password"
          placeholder="密码"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">登录</button>
      </form>
      <button onClick={() => navigate('/register')} style={{ marginTop: 8 }}>没有账号？去注册</button>
    </div>
  );
}