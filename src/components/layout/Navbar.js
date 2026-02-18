import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await logout();
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand">
          Tower<span>Pro</span>
        </NavLink>
        <div className="navbar-links">
          <NavLink to="/" className={({ isActive }) => 'navbar-link' + (isActive ? ' active' : '')} end>
            Reports
          </NavLink>
          <NavLink to="/inspectors" className={({ isActive }) => 'navbar-link' + (isActive ? ' active' : '')}>
            Inspectors
          </NavLink>
          <button
            className="btn btn-sm"
            style={{ background: 'rgba(255,255,255,.15)', color: '#fff', minHeight: 34 }}
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? '…' : 'Sign out'}
          </button>
        </div>
      </div>
    </nav>
  );
}
