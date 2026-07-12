import { useState } from 'react';
import { Link, useNavigate, useLocation  } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ChangePassword from './ChangePassword';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showChangePassword, setShowChangePassword] = useState(false);

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/register";

  if (hideNavbar) return null;



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
                className="btn-password"
                onClick={() => setShowChangePassword(true)}
              >
                Change Password
              </button>
              <button className="btn-danger" onClick={handleLogout}>
                Logout
              </button>
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