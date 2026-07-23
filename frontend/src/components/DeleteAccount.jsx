import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { TriangleAlert } from "lucide-react"
import api from "../api/axios";
import PasswordInput from "./PasswordInput";
import { useAuth } from "../context/AuthContext";
import { loginSchema, getZodErrors } from '../utils/validationSchemas';


const DeleteAccount = ({ onCancel }) => {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState({ password: false });
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const { clearAuth } = useAuth();

    const validateField = (field, value) => {
    const result = loginSchema.safeParse({
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

    const handleDelete = async () => {
        if (!password.trim()) {
            return toast.error("Password is required.");
        }

        const confirmed = window.confirm(
            "Are you sure you want to permanently delete your account?"
        );

        if (!confirmed) {
            return;
        }

        setLoading(true);

        try {
            const { data } = await api.delete("/profile", {
                data: { password }
            });

            clearAuth();

            navigate("/login");
            
            toast.success(data.message);

        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                "Unable to delete account."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="delete-account">

           <div className="danger-box">

                <div className="danger-header">
                    <TriangleAlert size={20} />
                    <h4>Danger Zone</h4>
                </div>

                <p>
                    Deleting your account is permanent.
                    This action cannot be undone.
                </p>

                <ul className="danger-list">
                    <li>Your profile will be permanently removed.</li>
                    <li>Your existing tasks will remain for history.</li>
                    <li>Your name will appear as "(Deleted)" on previous tasks.</li>
                </ul>

            </div>

            <PasswordInput 

                value={password}
                onChange={(e) => handleChange('password', e.target.value, setPassword)}
                error={errors.password}
                touched={touched.password}
                showRequirements={false}
            />

            <div className="profile-actions">

                <button
                    className="btn-danger"
                    disabled={loading}
                    onClick={handleDelete}
                >
                    {loading
                        ? "Deleting..."
                        : "Delete Account"}
                </button>

                <button
                    className="btn-cancel"
                    disabled={loading}
                    onClick={onCancel}
                >
                    Cancel
                </button>

            </div>

        </div>
    );
};

export default DeleteAccount;