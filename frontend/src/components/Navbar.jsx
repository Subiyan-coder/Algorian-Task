import { Link, useNavigate, useLocation  } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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
              <div className="navbar-user">
                <img
                  src={
                    user.profileImage?.url ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`
                  }
                  alt={user.name}
                  className="navbar-avatar"
                />

                <span className="welcome">
                  {user.name} <small>({user.role})</small>
                </span>
              </div>
              <Link to="/tasks">Tasks</Link>
              <Link to="/profile">Profile</Link>

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
    </>
  );
};

export default Navbar;