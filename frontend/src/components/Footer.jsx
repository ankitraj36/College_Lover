import { Link } from 'react-router-dom';
import {
    FaGraduationCap,
    FaHeart,
    FaLinkedinIn,
    FaEnvelope,
    FaGithub,
    FaHome,
    FaBookOpen,
    FaInfoCircle,
    FaMapMarkerAlt,
    FaCode,
    FaArrowRight,
} from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="site-footer" id="footer">
            {/* Animated Top Border */}
            <div className="footer-gradient-border" />

            <div className="container">
                {/* Main Footer Grid */}
                <div className="footer-grid">
                    {/* Column 1 — Brand & About */}
                    <div className="footer-col footer-col-brand">
                        <div className="footer-brand">
                            <div className="footer-brand-icon">
                                <FaGraduationCap />
                            </div>
                            <span className="footer-brand-text">College Lover</span>
                        </div>
                        <p className="footer-about-text">
                            Your go-to study companion — free, open-access study materials
                            across 5 departments and all 8 semesters for ITER students.
                        </p>
                        <div className="footer-social-row">
                            <a
                                href="https://www.linkedin.com/in/ankit-raj-319201307/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-social-icon"
                                title="LinkedIn"
                                aria-label="LinkedIn Profile"
                            >
                                <FaLinkedinIn />
                            </a>
                            <a
                                href="mailto:ankitraj3736@gmail.com"
                                className="footer-social-icon"
                                title="Email"
                                aria-label="Send Email"
                            >
                                <FaEnvelope />
                            </a>
                            <a
                                href="https://github.com/ankitraj36"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-social-icon"
                                title="GitHub"
                                aria-label="GitHub Profile"
                            >
                                <FaGithub />
                            </a>
                        </div>
                    </div>

                    {/* Column 2 — Quick Links */}
                    <div className="footer-col">
                        <h4 className="footer-col-title">Quick Links</h4>
                        <ul className="footer-link-list">
                            <li>
                                <Link to="/">
                                    <FaHome className="footer-link-icon" /> Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/materials">
                                    <FaBookOpen className="footer-link-icon" /> Materials
                                </Link>
                            </li>
                            <li>
                                <a href="#departments">
                                    <FaCode className="footer-link-icon" /> Departments
                                </a>
                            </li>
                            <li>
                                <a href="#about">
                                    <FaInfoCircle className="footer-link-icon" /> About
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3 — Developer Info */}
                    <div className="footer-col">
                        <h4 className="footer-col-title">Developer</h4>
                        <div className="footer-dev-card">
                            <div className="footer-dev-avatar">AR</div>
                            <div className="footer-dev-info">
                                <span className="footer-dev-name">Ankit Raj</span>
                                <span className="footer-dev-role">Full-Stack Developer</span>
                            </div>
                        </div>
                        <ul className="footer-contact-list">
                            <li>
                                <a href="mailto:ankitraj3736@gmail.com">
                                    <FaEnvelope className="footer-link-icon" />
                                    <span>ankitraj3736@gmail.com</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.linkedin.com/in/ankit-raj-319201307/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <FaLinkedinIn className="footer-link-icon" />
                                    <span>LinkedIn Profile</span>
                                    <FaArrowRight className="footer-arrow" />
                                </a>
                            </li>
                            <li>
                                <span className="footer-location">
                                    <FaMapMarkerAlt className="footer-link-icon" />
                                    <span>ITER, SOA University, Bhubaneswar</span>
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="footer-divider" />

                {/* Copyright Bar */}
                <div className="footer-bottom">
                    <p className="footer-copyright">
                        © 2026 College Lover. Built with{' '}
                        <FaHeart className="heart-icon" /> for ITER students.
                    </p>
                    <p className="footer-tech">
                        Built with <strong>MongoDB</strong> · <strong>Express</strong> · <strong>React</strong> · <strong>Node.js</strong>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
