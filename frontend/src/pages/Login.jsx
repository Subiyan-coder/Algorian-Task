import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { loginSchema, getZodErrors } from '../utils/validationSchemas';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError({});
        setLoading(true);
    
        const result = loginSchema.safeParse({ email, password });
        if (!result.success) {
            setError(getZodErrors(result.error));
            setLoading(false);
            return;
        }
        try {
            const {data} = await api.post('/auth/login', { email, password });
            login(data.data);
            navigate('/tasks');
        }  catch (err) {
            const message = err.response?.data?.message || 'Login failed';
            const backendErrors = err.response?.data?.errors || [];
            setError({
                general: backendErrors.length > 0 ? backendErrors.join(', ') : message
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Login</h2>
            {error.general && <p className="error">{error.general}</p>}
            
            <form onSubmit={handleSubmit}>
                <input type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                 />
                {error.email && <p className="error">{error.email}</p>}

                <input type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                 />
                {error.password && <p className="error">{error.password}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <p> Don't have an account? <Link to="/register">Register</Link> </p>

        </div>
    );
};

export default Login;