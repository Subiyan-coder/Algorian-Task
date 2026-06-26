import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('staff');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const {login} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);   

        try {
            const {data} = await api.post('/auth/register', { name, email, contact, password, role });
            login(data.data);
            navigate('/tasks');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }   

    };

    return (
        <div className="form-container">
            <h2>Register</h2>
            {error && <p className="error">{error}</p>}

            <form onSubmit={handleSubmit}>
                <input type="text"
                    placeholder="User Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                required />

                <input type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                required />

                <input type="text"
                    placeholder="Contact Number"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                required />

                <input type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                required />

                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                </select>
                
                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default Register;