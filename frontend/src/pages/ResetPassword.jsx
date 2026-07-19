import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

import api from '../api/axios';
import PasswordInput from '../components/PasswordInput';

import {
    resetPasswordSchema,
    getZodErrors
} from '../utils/validationSchemas';

const ResetPassword = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;
    const resetToken = location.state?.resetToken;

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [touched, setTouched] = useState({
        password: false,
        confirmPassword: false
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (!email || !resetToken) {
            toast.error('Please verify OTP first.');
            navigate('/forgot-password');
        }

    }, [email, resetToken, navigate]);

    const validate = (passwordValue, confirmValue) => {

        const result = resetPasswordSchema.safeParse({
            password: passwordValue,
            confirmPassword: confirmValue
        });

        if (!result.success) {
            setErrors(getZodErrors(result.error));
        } else {
            setErrors({});
        }

    };

    const handlePasswordChange = (value) => {
        setPassword(value);
        setTouched(prev => ({ ...prev, password: true }));
        validate(value, confirmPassword);
    };

    const handleConfirmPasswordChange = (value) => {
        setConfirmPassword(value);
        setTouched(prev => ({ ...prev, confirmPassword: true }));
        validate(password, value);
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setTouched({
            password: true,
            confirmPassword: true
        });

        const result = resetPasswordSchema.safeParse({
            password,
            confirmPassword
        });

        if (!result.success) {
            setErrors(getZodErrors(result.error));
            return;
        }

        setLoading(true);

        try {

            const { data } = await api.put('/auth/reset-password', {
                resetToken,
                newPassword: password
            });

            toast.success(data.message);

            setTimeout(() => {
                navigate('/login');
            }, 1000);

        }
        catch (err) {

            toast.error(
                err.response?.data?.message || 'Unable to reset password.'
            );

        }
        finally {
            setLoading(false);
        }

    };

    return (

        <div className="form-container">

            <h2>Reset Password</h2>

            <form onSubmit={handleSubmit}>

                <PasswordInput
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    error={errors.password}
                    touched={touched.password}
                />

                <PasswordInput
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                    error={errors.confirmPassword}
                    touched={touched.confirmPassword}
                />

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Resetting...' : 'Reset Password'}
                </button>

            </form>

        </div>

    );

};

export default ResetPassword;