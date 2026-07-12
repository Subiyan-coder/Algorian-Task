import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { registerSchema, getZodErrors } from '../utils/validationSchemas';
import FormInput from '../components/FormInput';
import PasswordInput from '../components/PasswordInput';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({
    name: false, email: false, contact: false, password: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateField = (field, value) => {
    const formData = { name, email, contact, password, [field]: value };
    const result = registerSchema.safeParse(formData);

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
    setTouched({ name: true, email: true, contact: true, password: true });

    const result = registerSchema.safeParse({ name, email, contact, password });
    if (!result.success) {
      setErrors(getZodErrors(result.error));
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { name, email, contact, password });
      login(data.data);
      toast.success('Account created successfully!');
      setTimeout(() => navigate('/tasks'), 1000);
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to create your account.';
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
      <h2>Register</h2>


      <form onSubmit={handleSubmit}>
        <FormInput
          placeholder="Full name"
          value={name}
          onChange={(e) => handleChange('name', e.target.value, setName)}
          error={errors.name}
          touched={touched.name}
        />

        <FormInput
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => handleChange('email', e.target.value, setEmail)}
          error={errors.email}
          touched={touched.email}
        />

        <FormInput
          placeholder="Contact number"
          value={contact}
          onChange={(e) => handleChange('contact', e.target.value, setContact)}
          error={errors.contact}
          touched={touched.contact}
        />

        <PasswordInput
          value={password}
          onChange={(e) => handleChange('password', e.target.value, setPassword)}
          error={errors.password}
          touched={touched.password}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default Register;