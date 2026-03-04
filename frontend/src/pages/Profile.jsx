import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { FaUser, FaEnvelope, FaLock, FaSave, FaShieldAlt } from 'react-icons/fa';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await authAPI.updateProfile({ name, email });
            updateUser(data.user);
            toast.success('Profile updated!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        setPasswordLoading(true);
        try {
            await authAPI.updatePassword({ currentPassword, newPassword });
            toast.success('Password updated!');
            setCurrentPassword('');
            setNewPassword('');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update password');
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="profile-page">
            <div className="container">
                <div className="profile-header">
                    <div className="profile-avatar-lg">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1>{user?.name}</h1>
                        <p>{user?.email}</p>
                        <span className={`role-tag ${user?.role}`}>
                            <FaShieldAlt /> {user?.role}
                        </span>
                    </div>
                </div>

                <div className="profile-grid">
                    {/* Profile Info */}
                    <div className="profile-card">
                        <h3><FaUser /> Profile Information</h3>
                        <form onSubmit={handleProfileUpdate}>
                            <div className="form-group">
                                <label><FaUser /> Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your name"
                                />
                            </div>
                            <div className="form-group">
                                <label><FaEnvelope /> Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                />
                            </div>
                            <button type="submit" className="btn-save" disabled={loading}>
                                <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    </div>

                    {/* Change Password */}
                    <div className="profile-card">
                        <h3><FaLock /> Change Password</h3>
                        <form onSubmit={handlePasswordChange}>
                            <div className="form-group">
                                <label>Current Password</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="form-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Min 6 characters"
                                />
                            </div>
                            <button type="submit" className="btn-save" disabled={passwordLoading}>
                                <FaLock /> {passwordLoading ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
