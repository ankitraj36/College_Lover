import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { materialAPI } from '../services/api';
import MaterialCard from '../components/MaterialCard';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
    FaSearch,
    FaTimes,
    FaLaptopCode,
    FaCode,
    FaBrain,
    FaChartLine,
    FaMicrochip,
    FaSeedling,
    FaLeaf,
    FaTree,
    FaSun,
    FaFire,
    FaBolt,
    FaRocket,
    FaTrophy,
    FaBookReader,
    FaCheckCircle,
    FaArrowUp,
    FaFilter,
    FaSyncAlt,
    FaBookOpen,
    FaGraduationCap,
    FaCalendarAlt,
    FaUniversity,
    FaInfoCircle,
    FaHeart,
} from 'react-icons/fa';


const deptConfig = [
    { name: 'Computer Science', icon: <FaLaptopCode />, desc: 'CS / CSE Branch', cls: 'dept-cs' },
    { name: 'CSIT', icon: <FaCode />, desc: 'CS & Information Technology', cls: 'dept-csit' },
    { name: 'AI & ML', icon: <FaBrain />, desc: 'Artificial Intelligence', cls: 'dept-ai' },
    { name: 'Data analytics', icon: <FaChartLine />, desc: 'Data Science & Analytics', cls: 'dept-da' },
    { name: 'IoT', icon: <FaMicrochip />, desc: 'Internet of Things', cls: 'dept-iot' },
];

const semIcons = [
    <FaSeedling />, <FaLeaf />, <FaTree />, <FaSun />,
    <FaFire />, <FaBolt />, <FaRocket />, <FaTrophy />,
];

const Home = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const [materials, setMaterials] = useState([]);
    const [filteredMaterials, setFilteredMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState({ type: null, value: null });
    const [deptCounts, setDeptCounts] = useState({});
    const [showScrollTop, setShowScrollTop] = useState(false);
    const materialsRef = useRef(null);

    useEffect(() => {
        fetchMaterials();
        const handleScroll = () => setShowScrollTop(window.scrollY > 400);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const fetchMaterials = async () => {
        try {
            const { data } = await materialAPI.getAll({ limit: 100 });
            setMaterials(data.materials);
            setFilteredMaterials(data.materials);
            calculateDeptCounts(data.materials);
        } catch (err) {
            toast.error('Failed to load materials');
        } finally {
            setLoading(false);
        }
    };

    const calculateDeptCounts = (mats) => {
        const counts = {};
        deptConfig.forEach((d) => {
            counts[d.name] = mats.filter((m) =>
                Array.isArray(m.subject) ? m.subject.includes(d.name) : m.subject === d.name
            ).length;
        });
        setDeptCounts(counts);
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase().trim();
        setSearchTerm(e.target.value);

        if (!term) {
            resetFilters();
            return;
        }

        const filtered = materials.filter((m) => {
            const titleMatch = m.title.toLowerCase().includes(term);
            const semMatch = m.semester.toLowerCase().includes(term);
            const subMatch = Array.isArray(m.subject)
                ? m.subject.some((s) => s.toLowerCase().includes(term))
                : (m.subject || '').toLowerCase().includes(term);
            return titleMatch || semMatch || subMatch;
        });

        setFilteredMaterials(filtered);
        setActiveFilter({ type: 'search', value: `Search: "${term}"` });
    };

    const filterByDept = (dept) => {
        const filtered = materials.filter((m) =>
            Array.isArray(m.subject) ? m.subject.includes(dept) : m.subject === dept
        );
        setFilteredMaterials(filtered);
        setActiveFilter({ type: 'dept', value: dept });
        setSearchTerm('');
        materialsRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const filterBySemester = (semNum) => {
        const suffixes = ['st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th'];
        const semLabel = `${semNum}${suffixes[semNum - 1]} Sem`;

        const filtered = materials.filter((m) =>
            m.semester.toLowerCase().includes(semLabel.toLowerCase())
        );
        setFilteredMaterials(filtered);
        setActiveFilter({ type: 'semester', value: String(semNum) });
        setSearchTerm('');
        materialsRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const resetFilters = () => {
        setFilteredMaterials(materials);
        setActiveFilter({ type: null, value: null });
        setSearchTerm('');
    };

    const handleLike = async (id) => {
        if (!isAuthenticated) {
            toast.error('Please login to like materials');
            return;
        }
        try {
            await materialAPI.toggleLike(id);
            fetchMaterials();
        } catch {
            toast.error('Failed to like material');
        }
    };

    const handleBookmark = async (id) => {
        if (!isAuthenticated) {
            toast.error('Please login to bookmark materials');
            return;
        }
        try {
            await materialAPI.toggleBookmark(id);
            toast.success('Bookmark updated!');
        } catch {
            toast.error('Failed to bookmark');
        }
    };

    const handleDownload = async (id) => {
        try {
            await materialAPI.trackDownload(id);
        } catch {
            // silent fail
        }
    };

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section" id="hero">
                <div className="hero-particles" id="heroParticles">
                    {Array.from({ length: 30 }).map((_, i) => (
                        <div
                            key={i}
                            className="hero-particle"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 8}s`,
                                animationDuration: `${6 + Math.random() * 6}s`,
                                width: `${2 + Math.random() * 4}px`,
                                height: `${2 + Math.random() * 4}px`,
                            }}
                        />
                    ))}
                </div>
                <div className="hero-overlay" />
                <div className="container hero-content">
                    <div className="hero-badge">
                        ✨ Your Study Companion
                    </div>
                    <h1 className="hero-title">
                        Find Your <span className="gradient-text">Study Material</span>
                    </h1>
                    <p className="hero-subtitle">
                        Search by subject, semester, branch, or book title — across all 8 semesters
                    </p>

                    <div className="search-wrapper">
                        <div className="search-box">
                            <FaSearch className="search-icon" />
                            <input
                                type="text"
                                className="search-input"
                                placeholder="e.g., Data Structures, 3rd Sem, CSIT, AI..."
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                            {searchTerm && (
                                <button
                                    className="search-clear-btn visible"
                                    onClick={() => {
                                        setSearchTerm('');
                                        resetFilters();
                                    }}
                                >
                                    <FaTimes />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="hero-stats">
                        <div className="stat-item">
                            <div className="stat-number">{materials.length}</div>
                            <div className="stat-label">Resources</div>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat-item">
                            <div className="stat-number">5</div>
                            <div className="stat-label">Departments</div>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat-item">
                            <div className="stat-number">8</div>
                            <div className="stat-label">Semesters</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Departments */}
            <section id="departments" className="section-departments">
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge"><FaUniversity /> Departments</span>
                        <h2 className="section-title">Browse by Department</h2>
                        <p className="section-subtitle">Select your branch to find relevant study materials</p>
                    </div>
                    <div className="dept-grid">
                        {deptConfig.map((dept) => (
                            <div
                                key={dept.name}
                                className="dept-card-wrapper"
                                onClick={() => filterByDept(dept.name)}
                            >
                                <div className={`dept-card ${activeFilter.type === 'dept' && activeFilter.value === dept.name ? 'active' : ''}`}>
                                    <div className={`dept-icon-wrap ${dept.cls}`}>
                                        {dept.icon}
                                    </div>
                                    <h5 className="dept-name">{dept.name}</h5>
                                    <p className="dept-desc">{dept.desc}</p>
                                    <span className="dept-count">{deptCounts[dept.name] || 0} notes</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Semesters — Modern Dropdown + Slider */}
            <section id="semesters" className="section-semesters">
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge"><FaCalendarAlt /> Semesters</span>
                        <h2 className="section-title">Filter by Semester</h2>
                        <p className="section-subtitle">Choose any semester from 1st to 8th</p>
                    </div>

                    <div className="sem-filter-panel">
                        {/* Current Selection Display */}
                        {activeFilter.type === 'semester' && (() => {
                            const semNum = parseInt(activeFilter.value);
                            const suffixes = ['st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th'];
                            const semLabels = ['Foundation Phase', 'Growth Phase', 'Core Phase', 'Intermediate Phase', 'Advanced Phase', 'Specialization Phase', 'Project Phase', 'Final Phase'];
                            return (
                                <div className="sem-active-display">
                                    <div className="sem-active-icon">{semIcons[semNum - 1]}</div>
                                    <div className="sem-active-info">
                                        <span className="sem-active-num">{semNum}{suffixes[semNum - 1]} Semester</span>
                                        <span className="sem-active-phase">{semLabels[semNum - 1]}</span>
                                    </div>
                                    <span className="sem-active-count">
                                        {filteredMaterials.length} resource{filteredMaterials.length !== 1 ? 's' : ''}
                                    </span>
                                </div>
                            );
                        })()}

                        <div className="sem-filter-controls">
                            {/* Dropdown Selector */}
                            <div className="sem-dropdown-group">
                                <label className="sem-control-label" htmlFor="semesterDropdown">
                                    <FaGraduationCap /> Select Semester
                                </label>
                                <select
                                    id="semesterDropdown"
                                    className="sem-dropdown"
                                    value={activeFilter.type === 'semester' ? parseInt(activeFilter.value) || '' : ''}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val) filterBySemester(Number(val));
                                        else resetFilters();
                                    }}
                                >
                                    <option value="">All Semesters</option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
                                        const suffixes = ['st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th'];
                                        return (
                                            <option key={num} value={num}>
                                                {num}{suffixes[num - 1]} Semester
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            {/* Range Slider */}
                            <div className="sem-slider-group">
                                <label className="sem-control-label" htmlFor="semesterSlider">
                                    <FaFilter /> Slide to Select
                                </label>
                                <div className="sem-slider-wrapper">
                                    <div className="sem-slider-track">
                                        <div
                                            className="sem-slider-fill"
                                            style={{
                                                width: activeFilter.type === 'semester'
                                                    ? `${((parseInt(activeFilter.value) - 1) / 7) * 100}%`
                                                    : '0%'
                                            }}
                                        />
                                    </div>
                                    <input
                                        id="semesterSlider"
                                        type="range"
                                        min="1"
                                        max="8"
                                        step="1"
                                        value={activeFilter.type === 'semester' ? parseInt(activeFilter.value) || 1 : 1}
                                        onChange={(e) => filterBySemester(Number(e.target.value))}
                                        className="sem-slider-input"
                                    />
                                    <div className="sem-slider-ticks">
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                                            <button
                                                key={n}
                                                type="button"
                                                className={`sem-slider-tick ${activeFilter.type === 'semester' && parseInt(activeFilter.value) === n
                                                    ? 'active'
                                                    : ''
                                                    }`}
                                                onClick={() => filterBySemester(n)}
                                            >
                                                {n}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Reset Button */}
                            <div className="sem-reset-group">
                                <button
                                    className={`sem-reset-btn ${activeFilter.type ? 'has-filter' : ''}`}
                                    onClick={resetFilters}
                                    title="Reset all filters"
                                >
                                    <FaSyncAlt className="sem-reset-icon" />
                                    <span>Reset</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Materials */}
            <section id="materials" className="section-materials" ref={materialsRef}>
                <div className="container">
                    <div className="materials-header">
                        <div>
                            <h3 className="materials-title">
                                <FaBookOpen />{' '}
                                {activeFilter.value
                                    ? `${activeFilter.type === 'semester'
                                        ? (() => {
                                            const n = parseInt(activeFilter.value);
                                            const sfx = ['st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th'];
                                            return `${n}${sfx[n - 1]} Semester`;
                                        })()
                                        : activeFilter.value} Materials`
                                    : 'All Study Materials'}
                            </h3>
                            <p className="materials-subtitle">
                                Showing {filteredMaterials.length} resource{filteredMaterials.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                        <div className="materials-actions">
                            {activeFilter.type && (
                                <div className="active-filters">
                                    <span className="filter-label"><FaFilter /> Active:</span>
                                    <span className="filter-tag">
                                        {activeFilter.type === 'semester'
                                            ? (() => {
                                                const n = parseInt(activeFilter.value);
                                                const sfx = ['st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th'];
                                                return `${n}${sfx[n - 1]} Semester`;
                                            })()
                                            : activeFilter.value}
                                    </span>
                                </div>
                            )}
                            <button className="filter-reset-btn" onClick={resetFilters} title="Reset Filters">
                                <FaSyncAlt />
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-spinner">
                            <div className="spin-animation" style={{ fontSize: '2rem', color: 'var(--primary)' }}>⏳</div>
                            <p>Loading materials...</p>
                        </div>
                    ) : filteredMaterials.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📂</div>
                            <h4>No materials found</h4>
                            <p>Try adjusting your search or filter criteria</p>
                        </div>
                    ) : (
                        <div className="materials-grid">
                            {filteredMaterials.map((mat, i) => (
                                <MaterialCard
                                    key={mat._id}
                                    material={mat}
                                    index={i}
                                    onLike={handleLike}
                                    onBookmark={handleBookmark}
                                    onDownload={handleDownload}
                                    isLiked={mat.likes?.includes(user?._id)}
                                    isBookmarked={user?.bookmarks?.includes(mat._id)}
                                    showActions={isAuthenticated}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* About */}
            <section id="about" className="section-about">
                <div className="container">
                    <div className="about-card">
                        <div className="about-grid">
                            <div className="about-text-section">
                                <span className="section-badge"><FaHeart /> About Us</span>
                                <h2 className="about-title">Built For Students,<br />By Students</h2>
                                <p className="about-text">
                                    College Lover is your go-to platform for finding study materials across multiple departments
                                    and semesters. Whether you're in Computer Science, CSIT, AI & ML, Data Analytics, or IoT —
                                    we've got you covered from 1st semester all the way to 8th semester.
                                </p>
                                <div className="about-features">
                                    {['Free & Open Access', '5 Departments Covered', 'All 8 Semesters', 'Updated Regularly'].map((f) => (
                                        <div className="about-feature" key={f}>
                                            <FaCheckCircle /> <span>{f}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="about-illustration-section">
                                <div className="about-illustration">
                                    <FaBookReader />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Scroll to Top */}
            {showScrollTop && (
                <button
                    className="scroll-top-btn visible"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    title="Back to top"
                >
                    <FaArrowUp />
                </button>
            )}
        </div>
    );
};

export default Home;
