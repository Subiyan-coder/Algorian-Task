import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';
import OtpInput from '../components/OtpInput';
import { verifyOtpSchema, getZodErrors } from '../utils/validationSchemas';

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [otp, setOtp] = useState('');
  const [touched, setTouched] = useState({ otp: false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      toast.error('Please request an OTP first.');
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const validateField = (value) => {
    const result = verifyOtpSchema.safeParse({ otp: value });

    if (!result.success) {
      setErrors(getZodErrors(result.error));
    } else {
      setErrors({});
    }
  };

  const handleChange = (value) => {
    setOtp(value);
    setTouched({ otp: true });
    validateField(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({ otp: true });

    const result = verifyOtpSchema.safeParse({ otp });

    if (!result.success) {
      setErrors(getZodErrors(result.error));
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post('/auth/verify-otp', {
        email,
        otp
      });

      toast.success(data.message);

      navigate('/reset-password', {
        state: {
          email,
          resetToken: data.data.resetToken
        }
      });

    } catch (err) {
      toast.error(
        err.response?.data?.message || 'OTP verification failed.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Verify OTP</h2>

      <p style={{ marginBottom: '1rem' }}>
        Enter the 6-digit OTP sent to <strong>{email}</strong>
      </p>

      <form onSubmit={handleSubmit}>
        <OtpInput
            value={otp}
            onChange={handleChange}
            error={errors.otp}
            touched={touched.otp}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>

      <p>
        Wrong email?{' '}
        <Link to="/forgot-password">
          Go Back
        </Link>
      </p>
    </div>
  );
};

export default VerifyOtp;