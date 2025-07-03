import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function AuthLayout() {
  const [user, setUser] = useState({ username: '测试用户' });
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="layout-root">
      <nav className="navbar">
        <div className="nav-links">
          <Link to="/">仪表盘</Link>
          <Link to="/tasks">任务列表</Link>
          <Link to="/settings">设置</Link>
        </div>
        <div className="nav-user">
          {user ? (
            <>
              欢迎，{user.username}！
              <button onClick={handleLogout} style={{ marginLeft: 8 }}>退出</button>
            </>
          ) : (
            <>
              <Link to="/login">登录</Link>
              <Link to="/register" style={{ marginLeft: 8 }}>注册</Link>
            </>
          )}
        </div>
      </nav>
      <main className="page-content">
        <Outlet />
      </main>
    </div>
  );
}