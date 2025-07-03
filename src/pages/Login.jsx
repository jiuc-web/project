import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username && password) {
      alert('登录成功！');
      navigate('/');
    } else {
      alert('请输入用户名和密码');
    }
  };

  return (
    <div>
      <h1>登录</h1>
      <form onSubmit={handleLogin}>
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
        <button type="submit">登录</button>
      </form>
      <button onClick={() => navigate('/register')} style={{ marginTop: 8 }}>没有账号？去注册</button>
    </div>
  );
}