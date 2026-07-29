import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">✦</span>
        <h1 className="navbar-title">TaskFlow</h1>
      </div>

      <div className="navbar-user">
        <span className="user-greeting">
          Welcome, <strong>{user?.name || 'User'}</strong>
        </span>
        <button type="button" className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
