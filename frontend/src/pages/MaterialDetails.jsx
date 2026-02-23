import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { materialAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
    FaArrowLeft,
    FaDownload,
    FaHeart,
    FaRegHeart,
    FaBookmark,
    FaRegBookmark,
    FaTag,
    FaCalendar,
    FaUser,
    FaClock,
    FaFileAlt,
    FaHdd,
    FaExternalLinkAlt,
    FaTrash,
    FaEdit,
    FaCommentDots,
    FaPaperPlane,
    FaCheckCircle,
    FaTimesCircle,
    FaBarcode,
    FaStar,
    FaGraduationCap,
} from 'react-icons/fa';

const MaterialDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, isAdmin, user } = useAuth();
    const [material, setMaterial] = useState(null);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState('');
    const [commenting, setCommenting] = useState(false);

    useEffect(() => {
        fetchMaterial();
    }, [id]);

    const fetchMaterial = async () => {
        try {
            const { data } = await materialAPI.getOne(id);
            setMaterial(data.material);
        } catch (err) {
            toast.error('Material not found');
            navigate('/materials');
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        if (!isAuthenticated) return toast.error('Please login first');
        try {
            const { data } = await materialAPI.toggleLike(id);
            fetchMaterial();
            toast.success(data.liked ? 'Liked!' : 'Unliked');
        } catch { toast.error('Failed'); }
    };

    const handleBookmark = async () => {
        if (!isAuthenticated) return toast.error('Please login first');
        try {
            const { data } = await materialAPI.toggleBookmark(id);
            toast.success(data.bookmarked ? 'Bookmarked!' : 'Removed bookmark');
        } catch { toast.error('Failed'); }
    };

    const handleDownload = async () => {
        try { await materialAPI.trackDownload(id); } catch { }
    };

    const handleApprove = async (approved) => {
        try {
            await materialAPI.approve(id, { approved });
            toast.success(approved ? 'Material approved!' : 'Material rejected');
            fetchMaterial();
        } catch { toast.error('Failed'); }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this material?')) return;
        try {
            await materialAPI.delete(id);
            toast.success('Material deleted');
            navigate('/materials');
        } catch { toast.error('Failed to delete'); }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        setCommenting(true);
        try {
            await materialAPI.addComment(id, { text: commentText });
            setCommentText('');
            fetchMaterial();
            toast.success('Comment added!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to comment');
        } finally {
            setCommenting(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await materialAPI.deleteComment(id, commentId);
            fetchMaterial();
            toast.success('Comment deleted');
        } catch { toast.error('Failed'); }
    };

    if (loading) {
        return (
            <div className="detail-page">
                <div className="container">
                    <div className="loading-spinner">
                        <div className="spin-animation" style={{ fontSize: '2rem' }}>⏳</div>
                        <p>Loading material...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!material) return null;

    const isOwner = user?._id === material.uploadedBy?._id;
    const isLiked = material.likes?.some((l) => (typeof l === 'string' ? l : l._id) === user?._id);

    const gradingLabels = {
        1: 'Standard (Theory)',
        2: 'Lab / Practical',
        3: 'Project Based',
        4: 'Seminar',
        5: 'Combined (Theory + Lab)',
    };

    return (
        <div className="detail-page">
            <div className="container">
                <Link to="/materials" className="back-link">
                    <FaArrowLeft /> Back to Materials
                </Link>

                <div className="detail-layout">
                    {/* Main Content */}
                    <div className="detail-main">
                        <div className="detail-card">
                            {/* Status Badge */}
                            {isAdmin && (
                                <div className={`approval-badge ${material.approved ? 'approved' : 'pending'}`}>
                                    {material.approved ? <><FaCheckCircle /> Approved</> : <><FaTimesCircle /> Pending Approval</>}
                                </div>
                            )}

                            <h1 className="detail-title">{material.title}</h1>

                            {material.description && (
                                <p className="detail-description">{material.description}</p>
                            )}

                            <div className="detail-meta">
                                <div className="detail-meta-item">
                                    <FaCalendar />
                                    <span>{material.semester}</span>
                                </div>
                                <div className="detail-meta-item">
                                    <FaFileAlt />
                                    <span>{material.type}</span>
                                </div>
                                <div className="detail-meta-item">
                                    <FaHdd />
                                    <span>{material.size}</span>
                                </div>
                                <div className="detail-meta-item">
                                    <FaDownload />
                                    <span>{material.downloads} downloads</span>
                                </div>
                                <div className="detail-meta-item">
                                    <FaClock />
                                    <span>{new Date(material.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {/* Academic Info — Course Code, Credits, Grading */}
                            {(material.courseCode || material.credits > 0 || material.gradingPattern > 0) && (
                                <div className="detail-academic-info">
                                    {material.courseCode && (
                                        <div className="academic-badge course-code">
                                            <FaBarcode />
                                            <div>
                                                <span className="academic-label">Course Code</span>
                                                <span className="academic-value">{material.courseCode}</span>
                                            </div>
                                        </div>
                                    )}
                                    {material.credits > 0 && (
                                        <div className="academic-badge credits">
                                            <FaStar />
                                            <div>
                                                <span className="academic-label">Credits</span>
                                                <span className="academic-value">{material.credits}</span>
                                            </div>
                                        </div>
                                    )}
                                    {material.gradingPattern > 0 && (
                                        <div className="academic-badge grading">
                                            <FaGraduationCap />
                                            <div>
                                                <span className="academic-label">Grading</span>
                                                <span className="academic-value">
                                                    {gradingLabels[material.gradingPattern] || `Pattern ${material.gradingPattern}`}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="detail-tags">
                                {(Array.isArray(material.subject) ? material.subject : [material.subject]).map((s) => (
                                    <span key={s} className="dept-tag"><FaTag /> {s}</span>
                                ))}
                            </div>

                            {material.uploadedBy && (
                                <div className="detail-uploader">
                                    <FaUser />
                                    <span>Uploaded by <strong>{material.uploadedBy.name}</strong></span>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="detail-actions">
                                <a
                                    href={material.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-download"
                                    onClick={handleDownload}
                                >
                                    <FaExternalLinkAlt /> Open / Download
                                </a>

                                {isAuthenticated && (
                                    <>
                                        <button className={`action-btn-lg ${isLiked ? 'active' : ''}`} onClick={handleLike}>
                                            {isLiked ? <FaHeart /> : <FaRegHeart />}
                                            <span>{material.likes?.length || 0} Likes</span>
                                        </button>
                                        <button className="action-btn-lg" onClick={handleBookmark}>
                                            <FaBookmark /> Bookmark
                                        </button>
                                    </>
                                )}

                                {(isOwner || isAdmin) && (
                                    <button className="action-btn-lg danger" onClick={handleDelete}>
                                        <FaTrash /> Delete
                                    </button>
                                )}

                                {isAdmin && !material.approved && (
                                    <>
                                        <button className="action-btn-lg success" onClick={() => handleApprove(true)}>
                                            <FaCheckCircle /> Approve
                                        </button>
                                        <button className="action-btn-lg danger" onClick={() => handleApprove(false)}>
                                            <FaTimesCircle /> Reject
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="comments-section">
                            <h3><FaCommentDots /> Comments ({material.comments?.length || 0})</h3>

                            {isAuthenticated && (
                                <form className="comment-form" onSubmit={handleComment}>
                                    <textarea
                                        placeholder="Write a comment..."
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        rows="3"
                                        maxLength={500}
                                    />
                                    <button type="submit" disabled={commenting || !commentText.trim()}>
                                        <FaPaperPlane /> {commenting ? 'Posting...' : 'Post Comment'}
                                    </button>
                                </form>
                            )}

                            <div className="comments-list">
                                {(!material.comments || material.comments.length === 0) ? (
                                    <p className="no-comments">No comments yet. Be the first to comment!</p>
                                ) : (
                                    material.comments.map((c) => (
                                        <div key={c._id} className="comment-card">
                                            <div className="comment-header">
                                                <div className="comment-avatar">
                                                    {c.user?.name?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                                <div>
                                                    <strong>{c.user?.name || 'User'}</strong>
                                                    <small>{new Date(c.createdAt).toLocaleDateString()}</small>
                                                </div>
                                                {(user?._id === c.user?._id || isAdmin) && (
                                                    <button className="comment-delete" onClick={() => handleDeleteComment(c._id)}>
                                                        <FaTrash />
                                                    </button>
                                                )}
                                            </div>
                                            <p className="comment-text">{c.text}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaterialDetails;
