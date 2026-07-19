import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import api from '../api/axios';
import FormInput from '../components/FormInput';
import {
  forgotPasswordSchema,
  getZodErrors
} from '../utils/validationSchemas';

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState({ email: false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateField = (value) => {
    const result = forgotPasswordSchema.safeParse({ email: value });

    if (!result.success) {
      setErrors(getZodErrors(result.error));
    } else {
      setErrors({});
    }
  };

  const handleChange = (value) => {
    setEmail(value);
    setTouched({ email: true });
    validateField(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({ email: true });

    const result = forgotPasswordSchema.safeParse({ email });

    if (!result.success) {
      setErrors(getZodErrors(result.error));
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post('/auth/forgot-password', { email });

      toast.success(data.message);

      setTimeout(() => {
        navigate('/verify-otp', {
          state: { email }
        });
      }, 800);

    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Something went wrong.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Forgot Password</h2>

      <form onSubmit={handleSubmit}>
        <FormInput
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => handleChange(e.target.value)}
          error={errors.email}
          touched={touched.email}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </button>
      </form>

      <p>
        Remember your password?{' '}
        <Link to="/login">Back to Login</Link>
      </p>
    </div>
  );
};

export default ForgotPassword;