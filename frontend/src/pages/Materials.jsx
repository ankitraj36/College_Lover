import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { materialAPI } from '../services/api';
import MaterialCard from '../components/MaterialCard';
import UploadForm from '../components/UploadForm';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
    FaSearch,
    FaTimes,
    FaPlus,
    FaFilter,
    FaChevronLeft,
    FaChevronRight,
    FaSortAmountDown,
} from 'react-icons/fa';

const departments = ['Computer Science', 'CSIT', 'AI & ML', 'Data analytics', 'IoT'];
const types = ['PDF', 'PPT', 'DOCX', 'Lab Manual', 'Textbook', 'Notes', 'Link'];
const semesters = ['1st Sem', '2nd Sem', '3rd Sem', '4th Sem', '5th Sem', '6th Sem', '7th Sem', '8th Sem'];
const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'title', label: 'Title A-Z' },
    { value: 'downloads', label: 'Most Downloads' },
];

const Materials = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { isAuthenticated, user } = useAuth();
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUpload, setShowUpload] = useState(false);
    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 1,
        currentPage: 1,
    });

    // Filters
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [subject, setSubject] = useState(searchParams.get('subject') || '');
    const [semester, setSemester] = useState(searchParams.get('semester') || '');
    const [type, setType] = useState(searchParams.get('type') || '');
    const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchMaterials();
    }, [search, subject, semester, type, sort, searchParams.get('page')]);

    const fetchMaterials = async () => {
        setLoading(true);
        try {
            const page = parseInt(searchParams.get('page')) || 1;
            const params = { page, limit: 12, sort };
            if (search) params.search = search;
            if (subject) params.subject = subject;
            if (semester) params.semester = semester;
            if (type) params.type = type;

            const { data } = await materialAPI.getAll(params);
            setMaterials(data.materials);
            setPagination({
                total: data.total,
                totalPages: data.totalPages,
                currentPage: data.currentPage,
            });
        } catch (err) {
            toast.error('Failed to load materials');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchParams({ search, page: 1 });
    };

    const applyFilter = (key, value) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.set('page', '1');
        setSearchParams(params);
    };

    const clearAllFilters = () => {
        setSearch('');
        setSubject('');
        setSemester('');
        setType('');
        setSort('newest');
        setSearchParams({});
    };

    const goToPage = (page) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        setSearchParams(params);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleLike = async (id) => {
        if (!isAuthenticated) return toast.error('Please login to like materials');
        try {
            await materialAPI.toggleLike(id);
            fetchMaterials();
        } catch { toast.error('Failed'); }
    };

    const handleBookmark = async (id) => {
        if (!isAuthenticated) return toast.error('Please login to bookmark');
        try {
            await materialAPI.toggleBookmark(id);
            toast.success('Bookmark updated!');
        } catch { toast.error('Failed'); }
    };

    const handleDownload = async (id) => {
        try { await materialAPI.trackDownload(id); } catch { }
    };

    const hasActiveFilters = search || subject || semester || type;

    return (
        <div className="materials-page">
            <div className="materials-page-header">
                <div className="container">
                    <h1>📚 Study Materials</h1>
                    <p>Browse, search, and filter study materials across all departments</p>
                </div>
            </div>

            <div className="container materials-content">
                {/* Search & Actions Bar */}
                <div className="materials-toolbar">
                    <form className="search-form" onSubmit={handleSearch}>
                        <div className="search-box-inline">
                            <FaSearch className="search-icon-inline" />
                            <input
                                type="text"
                                placeholder="Search materials..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            {search && (
                                <button type="button" className="clear-btn" onClick={() => { setSearch(''); applyFilter('search', ''); }}>
                                    <FaTimes />
                                </button>
                            )}
                        </div>
                        <button type="submit" className="search-btn">Search</button>
                    </form>

                    <div className="toolbar-actions">
                        <button className="toolbar-btn" onClick={() => setShowFilters(!showFilters)}>
                            <FaFilter /> Filters {hasActiveFilters && <span className="filter-dot" />}
                        </button>
                        <select className="sort-select" value={sort} onChange={(e) => { setSort(e.target.value); applyFilter('sort', e.target.value); }}>
                            {sortOptions.map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                        {isAuthenticated && (
                            <button className="upload-btn" onClick={() => setShowUpload(true)}>
                                <FaPlus /> Upload
                            </button>
                        )}
                    </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="filters-panel">
                        <div className="filter-group">
                            <label>Department</label>
                            <div className="filter-chips">
                                {departments.map((d) => (
                                    <button
                                        key={d}
                                        className={`filter-chip ${subject === d ? 'active' : ''}`}
                                        onClick={() => { setSubject(subject === d ? '' : d); applyFilter('subject', subject === d ? '' : d); }}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="filter-group">
                            <label>Semester</label>
                            <div className="filter-chips">
                                {semesters.map((s) => (
                                    <button
                                        key={s}
                                        className={`filter-chip ${semester === s ? 'active' : ''}`}
                                        onClick={() => { setSemester(semester === s ? '' : s); applyFilter('semester', semester === s ? '' : s); }}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="filter-group">
                            <label>Type</label>
                            <div className="filter-chips">
                                {types.map((t) => (
                                    <button
                                        key={t}
                                        className={`filter-chip ${type === t ? 'active' : ''}`}
                                        onClick={() => { setType(type === t ? '' : t); applyFilter('type', type === t ? '' : t); }}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {hasActiveFilters && (
                            <button className="clear-all-btn" onClick={clearAllFilters}>
                                Clear All Filters
                            </button>
                        )}
                    </div>
                )}

                {/* Results Info */}
                <div className="results-info">
                    <span>Showing {materials.length} of {pagination.total} materials</span>
                </div>

                {/* Materials Grid */}
                {loading ? (
                    <div className="loading-spinner">
                        <div className="spin-animation" style={{ fontSize: '2rem' }}>⏳</div>
                        <p>Loading materials...</p>
                    </div>
                ) : materials.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📂</div>
                        <h4>No materials found</h4>
                        <p>Try adjusting your search or filter criteria</p>
                        {hasActiveFilters && (
                            <button className="btn-custom" onClick={clearAllFilters}>Clear Filters</button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="materials-grid">
                            {materials.map((mat, i) => (
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

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    className="page-btn"
                                    disabled={pagination.currentPage === 1}
                                    onClick={() => goToPage(pagination.currentPage - 1)}
                                >
                                    <FaChevronLeft />
                                </button>
                                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                                    .filter((p) => {
                                        const c = pagination.currentPage;
                                        return p === 1 || p === pagination.totalPages || (p >= c - 2 && p <= c + 2);
                                    })
                                    .map((p, idx, arr) => (
                                        <span key={p}>
                                            {idx > 0 && arr[idx - 1] !== p - 1 && <span className="page-dots">...</span>}
                                            <button
                                                className={`page-btn ${pagination.currentPage === p ? 'active' : ''}`}
                                                onClick={() => goToPage(p)}
                                            >
                                                {p}
                                            </button>
                                        </span>
                                    ))}
                                <button
                                    className="page-btn"
                                    disabled={pagination.currentPage === pagination.totalPages}
                                    onClick={() => goToPage(pagination.currentPage + 1)}
                                >
                                    <FaChevronRight />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Upload Modal */}
            {showUpload && (
                <UploadForm
                    onSuccess={() => { setShowUpload(false); fetchMaterials(); }}
                    onClose={() => setShowUpload(false)}
                />
            )}
        </div>
    );
};

export default Materials;
