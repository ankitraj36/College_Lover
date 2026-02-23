import { Link } from 'react-router-dom';
import {
    FaDownload,
    FaClock,
    FaHeart,
    FaRegHeart,
    FaBookmark,
    FaRegBookmark,
    FaTag,
    FaFileAlt,
    FaHdd,
    FaExternalLinkAlt,
    FaBarcode,
    FaStar,
    FaGraduationCap,
} from 'react-icons/fa';
import {
    FaLaptopCode,
    FaCode,
    FaBrain,
    FaChartLine,
    FaMicrochip,
    FaBook,
} from 'react-icons/fa';

const getIcon = (subjectString) => {
    if (subjectString.includes('Computer')) return <FaLaptopCode />;
    if (subjectString.includes('CSIT')) return <FaCode />;
    if (subjectString.includes('AI')) return <FaBrain />;
    if (subjectString.includes('Data')) return <FaChartLine />;
    if (subjectString.includes('IoT')) return <FaMicrochip />;
    return <FaBook />;
};

const getTypeColor = (type) => {
    switch (type) {
        case 'PDF':
            return '#ef4444';
        case 'PPT':
            return '#f59e0b';
        case 'DOCX':
            return '#3b82f6';
        case 'Lab Manual':
            return '#10b981';
        case 'Textbook':
            return '#06b6d4';
        default:
            return '#8b5cf6';
    }
};

const MaterialCard = ({
    material,
    onLike,
    onBookmark,
    onDownload,
    isLiked,
    isBookmarked,
    showActions = true,
    index = 0,
}) => {
    const subjectString = Array.isArray(material.subject)
        ? material.subject.join(' ')
        : material.subject || '';

    const isPlaceholder = material.fileUrl === '#';

    const handleDownload = (e) => {
        if (!isPlaceholder && onDownload) {
            onDownload(material._id);
        }
    };

    return (
        <div
            className="material-card"
            style={{ animationDelay: `${index * 0.05}s` }}
        >
            <div className="card-gradient-bar" />
            <div className="card-header-custom">
                <div className="icon-box">{getIcon(subjectString)}</div>
                <span className="sem-badge">{material.semester}</span>
            </div>

            <div className="card-body-custom">
                <Link to={`/materials/${material._id}`} className="card-title-link">
                    <h5 className="card-title">{material.title}</h5>
                </Link>

                {material.description && (
                    <p className="card-description">
                        {material.description.substring(0, 100)}
                        {material.description.length > 100 ? '...' : ''}
                    </p>
                )}

                <div className="meta-tags">
                    <div className="meta-item" style={{ color: getTypeColor(material.type) }}>
                        <FaFileAlt />
                        <span>{material.type}</span>
                    </div>
                    <div className="meta-item">
                        <FaHdd />
                        <span>{material.size}</span>
                    </div>
                    {material.downloads > 0 && (
                        <div className="meta-item">
                            <FaDownload />
                            <span>{material.downloads}</span>
                        </div>
                    )}
                    {material.courseCode && (
                        <div className="meta-item" style={{ color: '#8b5cf6' }}>
                            <FaBarcode />
                            <span>{material.courseCode}</span>
                        </div>
                    )}
                    {material.credits > 0 && (
                        <div className="meta-item" style={{ color: '#f59e0b' }}>
                            <FaStar />
                            <span>{material.credits} Credits</span>
                        </div>
                    )}
                </div>

                <div className="dept-tags">
                    {(Array.isArray(material.subject) ? material.subject : [material.subject]).map(
                        (s, i) => (
                            <span className="dept-tag" key={i}>
                                <FaTag /> {s}
                            </span>
                        )
                    )}
                </div>
            </div>

            <div className="card-footer-custom">
                <div className="card-actions">
                    {showActions && (
                        <>
                            <button
                                className={`action-btn like-btn ${isLiked ? 'active' : ''}`}
                                onClick={() => onLike && onLike(material._id)}
                                title="Like"
                            >
                                {isLiked ? <FaHeart /> : <FaRegHeart />}
                                <span>{material.likes?.length || material.likeCount || 0}</span>
                            </button>
                            <button
                                className={`action-btn bookmark-btn ${isBookmarked ? 'active' : ''}`}
                                onClick={() => onBookmark && onBookmark(material._id)}
                                title="Bookmark"
                            >
                                {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
                            </button>
                        </>
                    )}
                </div>

                <a
                    href={material.fileUrl}
                    target={isPlaceholder ? '_self' : '_blank'}
                    rel="noopener noreferrer"
                    className="btn-custom"
                    onClick={handleDownload}
                >
                    {isPlaceholder ? (
                        <>
                            <FaClock /> Coming Soon
                        </>
                    ) : material.links && material.links.length > 0 ? (
                        <>
                            <FaExternalLinkAlt /> Open
                        </>
                    ) : (
                        <>
                            <FaDownload /> Download
                        </>
                    )}
                </a>
            </div>
        </div>
    );
};

export default MaterialCard;
