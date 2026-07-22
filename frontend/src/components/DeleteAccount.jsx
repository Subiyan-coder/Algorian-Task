import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios";
import FormInput from "./FormInput";
import { useAuth } from "../context/AuthContext";

const DeleteAccount = ({ onCancel }) => {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { clearAuth } = useAuth();

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

            <h3 className="danger-title">
                Danger Zone
            </h3>

            <p className="danger-text">
                Deleting your account is permanent.
                This action cannot be undone.
            </p>

            <ul className="danger-list">
                <li>Your profile will be permanently removed.</li>
                <li>Your existing tasks will remain for history.</li>
                <li>Your name will appear as "(Deleted)" on previous tasks.</li>
            </ul>

            <FormInput
                label="Confirm Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                touched={true}
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
                    className="btn-secondary"
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