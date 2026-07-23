import { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import PasswordInput from './PasswordInput';
import Alert from './Alert';
import { getZodErrors, changePasswordSchema } from '../utils/validationSchemas';


const ChangePassword = ({onCancel }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [touched, setTouched] = useState({
    currentPassword: false,
    newPassword: false
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const validateField = (field, value) => {
    const formData = {
      currentPassword,
      newPassword,
      [field]: value
    };
    const result = changePasswordSchema.safeParse(formData);
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
    setTouched({ currentPassword: true, newPassword: true });

    const result = changePasswordSchema.safeParse({ currentPassword, newPassword });
    if (!result.success) {
      setErrors(getZodErrors(result.error));
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.put('/auth/change-password', {
        currentPassword,
        newPassword
      });

      login(data.data);

      setAlert({ type: 'success', message: 'Password changed successfully.' });
      setCurrentPassword('');
      setNewPassword('');

      setTouched({
          currentPassword:false,
          newPassword:false
      });

      setErrors({});

    } catch (err) {
      const message = err.response?.data?.message || 'Unable to change password.';
      setAlert({ type: 'error', message });
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="password-card" >
        
        <div className="password-header">
            <h3>Change Password</h3>
            <p>Update your account password.</p>
        </div>

        <Alert type={alert.type} message={alert.message} />

        <form onSubmit={handleSubmit}>
          <PasswordInput
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => handleChange('currentPassword', e.target.value, setCurrentPassword)}
            error={errors.currentPassword}
            touched={touched.currentPassword}
          />

          <PasswordInput
            placeholder="New password"
            value={newPassword}
            onChange={(e) => handleChange('newPassword', e.target.value, setNewPassword)}
            error={errors.newPassword}
            touched={touched.newPassword}
          />

          <div className="password-actions">

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Changing...' : 'Change Password'}
            </button>

            <button
                type="button"
                className="btn-cancel"
                onClick={onCancel}
            >
                Cancel
            </button>

          </div>
        </form>
    </div>
  );
};

export default ChangePassword;