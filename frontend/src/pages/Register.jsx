import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { registerSchema, getZodErrors } from '../utils/validationSchemas';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({}); 
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);


    const result = registerSchema.safeParse({ name, email, contact, password });

    if (!result.success) {
      setErrors(getZodErrors(result.error));
      setLoading(false);
      return; 
    }

    try {
      const { data } = await api.post('/auth/register', { name, email, contact, password });
      login(data.data);
      navigate('/tasks');
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      const backendErrors = err.response?.data?.errors || [];
      setErrors({
        general: backendErrors.length > 0 ? backendErrors.join(', ') : message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>

      {errors.general && <p className="error">{errors.general}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <p className="error">{errors.name}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <input
          type="text"
          placeholder="Contact number"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
        {errors.contact && <p className="error">{errors.contact}</p>}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <p className="error">{errors.password}</p>}


        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default Register;