import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { loginSchema, getZodErrors } from '../utils/validationSchemas';
import FormInput from '../components/FormInput';
import PasswordInput from '../components/PasswordInput';
import Alert from '../components/Alert';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateField = (field, value) => {
    const result = loginSchema.safeParse({
      email: field === 'email' ? value : email,
      password: field === 'password' ? value : password
    });

    if (!result.success) {
      const fieldErrors = getZodErrors(result.error);
      setErrors(prev => ({ ...prev, [field]: fieldErrors[field] }));
    } else {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleChange = (field, value, setter) => {
    setter(value);
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: '', message: '' });

    setTouched({ email: true, password: true });

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setErrors(getZodErrors(result.error));
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data.data);
      setAlert({ type: 'success', message: 'Login successful! Redirecting...' });
      setTimeout(() => navigate('/tasks'), 700);
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      const backendErrors = err.response?.data?.errors || [];
      setAlert({
        type: 'error',
        message: backendErrors.length > 0 ? backendErrors.join(', ') : message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>

      <Alert type={alert.type} message={alert.message} />

      <form onSubmit={handleSubmit}>
        <FormInput
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => handleChange('email', e.target.value, setEmail)}
          error={errors.email}
          touched={touched.email}
        />

        <PasswordInput
          value={password}
          onChange={(e) => handleChange('password', e.target.value, setPassword)}
          error={errors.password}
          touched={touched.password}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  );
};

export default Login;