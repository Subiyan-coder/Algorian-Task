import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { loginSchema, getZodErrors } from '../utils/validationSchemas';
import FormInput from '../components/FormInput';
import PasswordInput from '../components/PasswordInput'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });
  const [errors, setErrors] = useState({});
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
      toast.success('Logged in successfully!');
      setTimeout(() => navigate('/tasks'), 700);
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to log in.';
      const backendErrors = err.response?.data?.errors || [];
      toast.error(
        backendErrors.length > 0
          ? backendErrors.join(', ')
          : message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>


      <form onSubmit={handleSubmit}>
        <FormInput
          type="text"
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
          showRequirements={false}
        />

        <p style={{ textAlign: 'right', marginBottom: '1rem' }}>
          <Link to="/forgot-password">
            Forgot Password?
          </Link>
        </p>

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  );
};

export default Login;