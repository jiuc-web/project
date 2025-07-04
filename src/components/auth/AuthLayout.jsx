import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import UserProfileModal from '../settings/UserProfileModal';

export default function AuthLayout() {
  const [user, setUser] = useState({ username: '测试用户', nickname: '测试用户', signature: '这个人很懒', });
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
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
              <button onClick={() => setShowProfile(true)} style={{ marginRight: 8 }}>用户设置</button>
              欢迎，{user.nickname || user.username}！
              <button onClick={handleLogout} style={{ marginLeft: 8 }}>退出</button>
              <UserProfileModal open={showProfile} onClose={() => setShowProfile(false)} user={user} setUser={setUser} />
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