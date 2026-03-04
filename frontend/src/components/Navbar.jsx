import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    FaGraduationCap,
    FaHome,
    FaBook,
    FaSignInAlt,
    FaUserPlus,
    FaUser,
    FaTachometerAlt,
    FaSignOutAlt,
    FaBars,
    FaTimes,
    FaMoon,
    FaSun,
} from 'react-icons/fa';

const Navbar = () => {
    const { isAuthenticated, isAdmin, user, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(
        () => localStorage.getItem('collegeLoverTheme') === 'dark'
    );
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('collegeLoverTheme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('collegeLoverTheme', 'light');
        }
    }, [darkMode]);

    // Close menu on route change
    useEffect(() => {
        setMenuOpen(false);
        setDropdownOpen(false);
    }, [location]);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container navbar-container">
                <Link to="/" className="navbar-brand">
                    <div className="brand-icon">
                        <FaGraduationCap />
                    </div>
                    <span className="brand-text">College Lover</span>
                </Link>

                <button
                    className="navbar-toggler"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle navigation"
                >
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </button>

                <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
                    <ul className="nav-links">
                        <li>
                            <Link
                                to="/"
                                className={`nav-link ${isActive('/') ? 'active' : ''}`}
                            >
                                <FaHome className="nav-icon" /> Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/materials"
                                className={`nav-link ${isActive('/materials') ? 'active' : ''}`}
                            >
                                <FaBook className="nav-icon" /> Materials
                            </Link>
                        </li>

                        {isAuthenticated ? (
                            <>
                                {isAdmin && (
                                    <li>
                                        <Link
                                            to="/dashboard"
                                            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                                        >
                                            <FaTachometerAlt className="nav-icon" /> Dashboard
                                        </Link>
                                    </li>
                                )}
                                <li className="nav-dropdown">
                                    <button
                                        className="nav-link nav-dropdown-trigger"
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                    >
                                        <div className="nav-avatar">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <span>{user?.name?.split(' ')[0]}</span>
                                    </button>
                                    {dropdownOpen && (
                                        <div className="nav-dropdown-menu">
                                            <div className="dropdown-header">
                                                <strong>{user?.name}</strong>
                                                <small>{user?.email}</small>
                                                <span className="role-badge">{user?.role}</span>
                                            </div>
                                            <div className="dropdown-divider" />
                                            <Link to="/profile" className="dropdown-item">
                                                <FaUser /> Profile
                                            </Link>
                                            <button className="dropdown-item" onClick={handleLogout}>
                                                <FaSignOutAlt /> Logout
                                            </button>
                                        </div>
                                    )}
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link
                                        to="/login"
                                        className={`nav-link ${isActive('/login') ? 'active' : ''}`}
                                    >
                                        <FaSignInAlt className="nav-icon" /> Login
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/register" className="nav-link btn-register">
                                        <FaUserPlus className="nav-icon" /> Register
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>

                    <button
                        className="dark-mode-toggle"
                        onClick={() => setDarkMode(!darkMode)}
                        title="Toggle dark mode"
                        aria-label="Toggle dark mode"
                    >
                        {darkMode ? <FaSun className="toggle-sun" /> : <FaMoon />}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
