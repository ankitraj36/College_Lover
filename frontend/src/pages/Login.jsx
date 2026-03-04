import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaEnvelope, FaLock, FaSignInAlt, FaGraduationCap } from 'react-icons/fa';

const Login = () => {
    const { login, socialLogin, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [socialLoading, setSocialLoading] = useState('');
    const [errors, setErrors] = useState({});

    if (isAuthenticated) {
        navigate('/', { replace: true });
        return null;
    }

    const validate = () => {
        const errs = {};
        if (!formData.email) errs.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Invalid email format';
        if (!formData.password) errs.password = 'Password is required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            await login(formData);
            toast.success('Welcome back!');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider) => {
        setSocialLoading(provider);
        try {
            await socialLogin(provider);
            toast.success(`Signed in with ${provider === 'google' ? 'Google' : 'Apple'}!`);
            navigate('/');
        } catch (err) {
            const msg = err?.code === 'auth/popup-closed-by-user'
                ? 'Sign-in popup was closed'
                : err?.response?.data?.message || err.message || `${provider} sign-in failed`;
            toast.error(msg);
        } finally {
            setSocialLoading('');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="auth-icon">
                            <FaGraduationCap />
                        </div>
                        <h2>Welcome Back</h2>
                        <p>Sign in to access your study materials</p>
                    </div>

                    {/* ===== SOCIAL LOGIN BUTTONS ===== */}
                    <div className="social-login-section">
                        <button
                            type="button"
                            className="social-btn social-btn-google"
                            onClick={() => handleSocialLogin('google')}
                            disabled={!!socialLoading}
                        >
                            {socialLoading === 'google' ? (
                                <span className="social-btn-spinner"></span>
                            ) : (
                                <svg className="social-btn-icon" viewBox="0 0 24 24" width="20" height="20">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                            )}
                            <span>Continue with Google</span>
                        </button>

                        <button
                            type="button"
                            className="social-btn social-btn-apple"
                            onClick={() => handleSocialLogin('apple')}
                            disabled={!!socialLoading}
                        >
                            {socialLoading === 'apple' ? (
                                <span className="social-btn-spinner"></span>
                            ) : (
                                <svg className="social-btn-icon" viewBox="0 0 24 24" width="20" height="20">
                                    <path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                </svg>
                            )}
                            <span>Continue with Apple</span>
                        </button>
                    </div>

                    {/* ===== DIVIDER ===== */}
                    <div className="auth-divider">
                        <span>or sign in with email</span>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="email">
                                <FaEnvelope /> Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="your@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className={errors.email ? 'error' : ''}
                            />
                            {errors.email && <span className="error-text">{errors.email}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">
                                <FaLock /> Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className={errors.password ? 'error' : ''}
                            />
                            {errors.password && <span className="error-text">{errors.password}</span>}
                        </div>

                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                            {loading ? 'Signing in...' : <><FaSignInAlt /> Sign In</>}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Don't have an account?{' '}
                            <Link to="/register">Create one</Link>
                        </p>
                    </div>

                    <div className="auth-demo-box">
                        <p><strong>Demo Credentials:</strong></p>
                        <p>Admin: admin@collegelover.com / admin123</p>
                        <p>Student: rahul@student.com / student123</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
