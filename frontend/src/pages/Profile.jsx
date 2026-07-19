import { useEffect, useState } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import FormInput from '../components/FormInput';
import { useAuth } from '../context/AuthContext';
import ChangePassword from '../components/ChangePassword';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({name: '', contact: ''});
  const [saving, setSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const { updateUser } = useAuth();

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/profile');
      setProfile(data.data);
      setForm({
        name: data.data.name,
        contact: data.data.contact
        });
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        'Unable to load profile.'
      );
    } finally {
      setLoading(false);
    }
  };

const handleSave = async () => {
  setSaving(true);

  try {
    const { data } = await api.put('/profile', form);

    setProfile(data.data);
    updateUser(data.data);
    toast.success(data.message);

    setEditing(false);

  } catch (err) {
    toast.error(
      err.response?.data?.message ||
      'Unable to update profile.'
    );
  } finally {
    setSaving(false);
  }
};

const handleImageUpload = async () => {
  if (!selectedImage) {
    return toast.error('Please select an image.');
  }

  const formData = new FormData();
  formData.append('profileImage', selectedImage);

  setUploading(true);

  try {
    const { data } = await api.put('/profile/image', formData);

    setProfile(prev => ({
      ...prev,
      profileImage: data.data.profileImage
    }));

    updateUser({
        profileImage: data.data.profileImage
    });

    setSelectedImage(null);
    setPreview('');

    toast.success(data.message);

  } catch (err) {
    toast.error(
      err.response?.data?.message ||
      'Image upload failed.'
    );
  } finally {
    setUploading(false);
  }
};

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
        <div className="page-container">
            <div className="profile-card">

                <img
                    src={
                        preview ||
                        profile.profileImage?.url ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}`
                    }
                    alt={profile.name}
                    className="profile-avatar"
                />

                {editing ? (
                <>
                    <FormInput
                    label="Name"
                    value={form.name}
                    onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                    }
                    touched={true}
                    />

                    <FormInput
                    label="Contact"
                    value={form.contact}
                    onChange={(e) =>
                        setForm({ ...form, contact: e.target.value })
                    }
                    touched={true}
                    />

                    <div className="profile-actions">
                    <button
                        className="btn-primary"
                        disabled={saving}
                        onClick={handleSave}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>

                    <button
                        className="btn-secondary"
                        onClick={() => setEditing(false)}
                    >
                        Cancel
                    </button>
                    </div>
                </>
                ) : (
                <>

                    <h2>{profile.name}</h2>

                    <p className="profile-email">
                        {profile.email}
                    </p>

                    <div className="profile-info">

                        <div className="profile-info-row">
                            <span>Contact</span>
                            <span>{profile.contact || "-"}</span>
                        </div>

                        <div className="profile-info-row">
                            <span>Role</span>
                            <span>{profile.role}</span>
                        </div>

                    </div>

                    <div className="profile-upload">

                        <input
                            id="profileImage"
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              const file = e.target.files[0];

                              if (!file) return;

                              setSelectedImage(file);
                              setPreview(URL.createObjectURL(file));
                            }}
                        />

                        <label
                            htmlFor="profileImage"
                            className="btn-secondary upload-label"
                        >
                            📷 Change Photo
                        </label>

                        {selectedImage && (
                            <div className="profile-actions">

                                <button
                                    className="btn-primary"
                                    disabled={uploading}
                                    onClick={handleImageUpload}
                                >
                                    {uploading ? 'Uploading...' : 'Upload'}
                                </button>

                                <button
                                    className="btn-secondary"
                                    onClick={() => {
                                        setSelectedImage(null);
                                        setPreview('');
                                    }}
                                >
                                    Cancel
                                </button>

                            </div>
                        )}

                    </div>
                    
                    <div className="profile-section">
                      <button
                      className="btn-primary"
                      onClick={() => setEditing(true)}
                      >
                      Edit Profile
                      </button>

                     <hr className="profile-divider" />

                      {!showPasswordForm ? (
                          <button
                              className="btn-danger"
                              onClick={() => setShowPasswordForm(true)}
                          >
                              🔒 Change Password
                          </button>
                      ) : (
                          <div className="password-section">
                              <ChangePassword
                                  onCancel={() => setShowPasswordForm(false)}
                              />
                          </div>
                      )}

                    </div>

                </>
                )}

            </div>
        </div>
  );
};

export default Profile;