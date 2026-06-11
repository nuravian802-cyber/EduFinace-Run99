import React from 'react';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { useStore } from '../store/useStore';
import './Header.css';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { currentUser, logout } = useStore();

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-btn" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
      </div>
      <div className="header-right">
        <button className="icon-btn">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>
        <div className="user-profile">
          <div className="user-avatar">
            <User size={20} />
          </div>
          <div className="user-info" style={{ marginRight: '1rem' }}>
            <span className="user-name">{currentUser?.nama || 'User'}</span>
            <span className="user-role">{currentUser?.role || 'Guest'}</span>
          </div>
          <button 
            className="btn btn-outline" 
            style={{ padding: '0.4rem 0.8rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}
            onClick={logout}
          >
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
