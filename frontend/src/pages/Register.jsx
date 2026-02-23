import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaGraduationCap, FaChevronDown, FaLayerGroup } from 'react-icons/fa';

const SEMESTERS = [
    { num: 1, label: '1st Semester', sub: 'Foundation Phase', icon: '🌱' },
    { num: 2, label: '2nd Semester', sub: 'Growth Phase', icon: '🌿' },
    { num: 3, label: '3rd Semester', sub: 'Core Phase', icon: '🌳' },
    { num: 4, label: '4th Semester', sub: 'Intermediate Phase', icon: '☀️' },
    { num: 5, label: '5th Semester', sub: 'Advanced Phase', icon: '🔥' },
    { num: 6, label: '6th Semester', sub: 'Specialization Phase', icon: '⚡' },
    { num: 7, label: '7th Semester', sub: 'Project Phase', icon: '🚀' },
    { num: 8, label: '8th Semester', sub: 'Final Phase', icon: '🏆' },
];

const Register = () => {
    const { register, socialLogin, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        semester: '',
    });
    const [loading, setLoading] = useState(false);
    const [socialLoading, setSocialLoading] = useState('');
    const [errors, setErrors] = useState({});
    const [semOpen, setSemOpen] = useState(false);
    const dropdownRef = useRef(null);

    if (isAuthenticated) {
        navigate('/', { replace: true });
        return null;
    }

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setSemOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close on Escape
    useEffect(() => {
        const handleEsc = (e) => { if (e.key === 'Escape') setSemOpen(false); };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, []);

    const selectedSem = SEMESTERS.find(s => s.num === Number(formData.semester));

    const validate = () => {
        const errs = {};
        if (!formData.name.trim()) errs.name = 'Name is required';
        if (!formData.email) errs.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Invalid email';
        if (!formData.password) errs.password = 'Password is required';
        else if (formData.password.length < 6) errs.password = 'Min 6 characters';
        if (formData.password !== formData.confirmPassword)
            errs.confirmPassword = 'Passwords do not match';
        if (!formData.semester) errs.semester = 'Please select your semester';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                semester: Number(formData.semester),
            });
            toast.success('Account created successfully!');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider) => {
        setSocialLoading(provider);
        try {
            await socialLogin(provider);
            toast.success(`Signed up with ${provider === 'google' ? 'Google' : 'Apple'}!`);
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

    const handleSemSelect = (num) => {
        setFormData({ ...formData, semester: num });
        setErrors({ ...errors, semester: undefined });
        setSemOpen(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="auth-icon">
                            <FaGraduationCap />
                        </div>
                        <h2>Create Account</h2>
                        <p>Join the study material community</p>
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
                        <span>or register with email</span>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="name"><FaUser /> Full Name</label>
                            <input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className={errors.name ? 'error' : ''}
                            />
                            {errors.name && <span className="error-text">{errors.name}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email"><FaEnvelope /> Email</label>
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

                        {/* ===== FUTURISTIC SEMESTER DROPDOWN ===== */}
                        <div className="form-group">
                            <label><FaLayerGroup /> Semester</label>
                            <div className={`sem-select-wrapper ${errors.semester ? 'has-error' : ''}`} ref={dropdownRef}>
                                <button
                                    type="button"
                                    className={`sem-select-trigger ${semOpen ? 'open' : ''} ${selectedSem ? 'has-value' : ''}`}
                                    onClick={() => setSemOpen(!semOpen)}
                                    aria-haspopup="listbox"
                                    aria-expanded={semOpen}
                                >
                                    <div className="sem-select-trigger-glow"></div>
                                    <div className="sem-select-trigger-scanline"></div>
                                    <div className="sem-select-trigger-content">
                                        {selectedSem ? (
                                            <>
                                                <span className="sem-select-emoji">{selectedSem.icon}</span>
                                                <div className="sem-select-trigger-text">
                                                    <span className="sem-select-chosen">{selectedSem.label}</span>
                                                    <span className="sem-select-sub">{selectedSem.sub}</span>
                                                </div>
                                            </>
                                        ) : (
                                            <span className="sem-select-placeholder">Select your semester...</span>
                                        )}
                                    </div>
                                    <div className={`sem-select-arrow ${semOpen ? 'rotated' : ''}`}>
                                        <FaChevronDown />
                                    </div>
                                </button>

                                <div className={`sem-select-panel ${semOpen ? 'open' : ''}`} role="listbox">
                                    <div className="sem-select-panel-inner">
                                        <div className="sem-select-panel-header">
                                            <span>⚡ SEMESTER SELECT</span>
                                            <div className="sem-select-panel-line"></div>
                                        </div>
                                        <div className="sem-select-items">
                                            {SEMESTERS.map((sem, idx) => (
                                                <button
                                                    type="button"
                                                    key={sem.num}
                                                    className={`sem-select-item ${Number(formData.semester) === sem.num ? 'active' : ''}`}
                                                    onClick={() => handleSemSelect(sem.num)}
                                                    role="option"
                                                    aria-selected={Number(formData.semester) === sem.num}
                                                    style={{ animationDelay: semOpen ? `${idx * 0.03}s` : '0s' }}
                                                >
                                                    <div className="sem-select-item-idx">{String(sem.num).padStart(2, '0')}</div>
                                                    <div className="sem-select-item-body">
                                                        <span className="sem-select-item-name">{sem.label}</span>
                                                        <span className="sem-select-item-sub">{sem.sub}</span>
                                                    </div>
                                                    <span className="sem-select-item-emoji">{sem.icon}</span>
                                                    <div className="sem-select-item-glow"></div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {errors.semester && <span className="error-text">{errors.semester}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password"><FaLock /> Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Min 6 characters"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className={errors.password ? 'error' : ''}
                            />
                            {errors.password && <span className="error-text">{errors.password}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword"><FaLock /> Confirm Password</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                placeholder="Re-enter password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className={errors.confirmPassword ? 'error' : ''}
                            />
                            {errors.confirmPassword && (
                                <span className="error-text">{errors.confirmPassword}</span>
                            )}
                        </div>

                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                            {loading ? 'Creating Account...' : <><FaUserPlus /> Create Account</>}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Already have an account? <Link to="/login">Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
