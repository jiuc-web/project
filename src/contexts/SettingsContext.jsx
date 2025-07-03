import { createContext, useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import '../assets/css/App.css';

export const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    fontFamily: 'Arial',
    theme: 'light'
  });

  useEffect(() => {
    document.body.style.fontFamily = settings.fontFamily;
  }, [settings.fontFamily]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
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
    </SettingsContext.Provider>
  );
}