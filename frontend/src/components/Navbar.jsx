import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ChangePassword from './ChangePassword';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="logo">Assignment Tracker</Link>

        <div className="nav-links">
          {user ? (
            <>
              <span className="welcome">
                {user.name} <small>({user.role})</small>
              </span>
              <Link to="/tasks">Tasks</Link>
              <button
                className="btn-secondary"
                onClick={() => setShowChangePassword(true)}
              >
                Change Password
              </button>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>

      {showChangePassword && (
        <ChangePassword onClose={() => setShowChangePassword(false)} />
      )}
    </>
  );
};

export default Navbar;