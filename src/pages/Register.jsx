import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    if (username && password) {
      alert('注册成功！请登录');
      navigate('/login');
    } else {
      alert('请输入用户名和密码');
    }
  };

  return (
    <div>
      <h1>注册</h1>
      <form onSubmit={handleRegister}>
        <div>
          <input
            placeholder="用户名"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="密码"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">注册</button>
      </form>
      <button onClick={() => navigate('/login')} style={{ marginTop: 8 }}>已有账号？去登录</button>
    </div>
  );
}