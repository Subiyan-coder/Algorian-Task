import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate(); 

    const handleLogout = () => {
        logout();
        navigate('/login'); 
    };

    return (
        <nav className="navbar">
            <Link to="/" className="logo">Assignment Tracker</Link>
            <div className="nav-links">
            {user ? (
                <>
                    <span className="welcome">
                        Welcome, {user.name} <small>({user.role})</small>
                    </span>
                    <Link to="/tasks">My Tasks</Link>
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
    );
}

export default Navbar;

            