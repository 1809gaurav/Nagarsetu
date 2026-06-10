import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../utils/translations';
import { 
  FiHome, FiUsers, FiBriefcase, FiClock, FiCalendar, 
  FiDollarSign, FiTrendingUp, FiAlertCircle, FiLogOut,
  FiMenu, FiX, FiLayers
} from 'react-icons/fi';
import MCDLogo from './MCDLogo';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import './Layout.css';

const Layout = () => {
  const { user, logout } = useAuth();
  const { language } = useLanguage();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { path: '/dashboard', icon: FiHome, labelKey: 'dashboard', roles: ['Admin', 'HR Officer', 'Department Head', 'Employee'] },
    { path: '/employees', icon: FiUsers, labelKey: 'employees', roles: ['Admin', 'HR Officer', 'Department Head'] },
    { path: '/departments', icon: FiLayers, labelKey: 'departments', roles: ['Admin', 'HR Officer'] },
    { path: '/recruitment', icon: FiBriefcase, labelKey: 'recruitment', roles: ['Admin', 'HR Officer'] },
    { path: '/attendance', icon: FiClock, labelKey: 'attendance', roles: ['Admin', 'HR Officer', 'Department Head', 'Employee'] },
    { path: '/leaves', icon: FiCalendar, labelKey: 'leaves', roles: ['Admin', 'HR Officer', 'Department Head', 'Employee'] },
    { path: '/transfers', icon: FiUsers, labelKey: 'transfers', roles: ['Admin', 'HR Officer', 'Employee'] },
    { path: '/payroll', icon: FiDollarSign, labelKey: 'payroll', roles: ['Admin', 'HR Officer', 'Employee'] },
    { path: '/performance', icon: FiTrendingUp, labelKey: 'performance', roles: ['Admin', 'HR Officer', 'Department Head', 'Employee'] },
    { path: '/grievances', icon: FiAlertCircle, labelKey: 'grievances', roles: ['Admin', 'HR Officer', 'Department Head', 'Employee'] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role)
  );

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="layout">
      <header className="gov-header">
        <div className="header-content">
          <div className="header-left">
            <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <FiX /> : <FiMenu />}
            </button>
            <MCDLogo size={50} />
            <div>
              <h1>{t(language, 'appName')}</h1>
              <p className="tagline">{t(language, 'tagline')}</p>
            </div>
          </div>
          <div className="header-right">
            <LanguageSwitcher />
            <ThemeToggle />
            <span className="user-info">
              {t(language, user?.role?.toLowerCase().replace(/\s+/g, '')) || user?.role} - {user?.email}
            </span>
            <button className="btn btn-secondary" onClick={handleLogout}>
              <FiLogOut /> {t(language, 'logout')}
            </button>
          </div>
        </div>
      </header>

      <div className="layout-body">
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <nav className="sidebar-nav">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon />
                  <span>{t(language, item.labelKey)}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;


