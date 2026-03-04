import { useState, useEffect } from 'react';
import { materialAPI, userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
    FaChartBar,
    FaUsers,
    FaBook,
    FaDownload,
    FaCheckCircle,
    FaClock,
    FaTrash,
    FaCheck,
    FaTimes,
    FaUserShield,
    FaUserGraduate,
    FaEye,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [pendingMaterials, setPendingMaterials] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, pendingRes, usersRes] = await Promise.all([
                materialAPI.getStats(),
                materialAPI.getAll({ approved: false, limit: 50 }),
                userAPI.getAll({ limit: 50 }),
            ]);
            setStats(statsRes.data.stats);
            setPendingMaterials(pendingRes.data.materials);
            setAllUsers(usersRes.data.users);
        } catch (err) {
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id, approved) => {
        try {
            await materialAPI.approve(id, { approved });
            toast.success(approved ? 'Material approved!' : 'Material rejected');
            fetchDashboardData();
        } catch { toast.error('Failed'); }
    };

    const handleDeleteMaterial = async (id) => {
        if (!window.confirm('Delete this material?')) return;
        try {
            await materialAPI.delete(id);
            toast.success('Deleted');
            fetchDashboardData();
        } catch { toast.error('Failed'); }
    };

    const handleRoleChange = async (userId, role) => {
        try {
            await userAPI.updateRole(userId, { role });
            toast.success(`Role updated to ${role}`);
            fetchDashboardData();
        } catch { toast.error('Failed'); }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Delete this user?')) return;
        try {
            await userAPI.delete(userId);
            toast.success('User deleted');
            fetchDashboardData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed');
        }
    };

    if (loading) {
        return (
            <div className="dashboard-page">
                <div className="container">
                    <div className="loading-spinner">
                        <div className="spin-animation" style={{ fontSize: '2rem' }}>⏳</div>
                        <p>Loading dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="dashboard-header">
                    <div>
                        <h1>🎛️ Admin Dashboard</h1>
                        <p>Welcome back, {user?.name}!</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="dashboard-tabs">
                    {['overview', 'pending', 'users'].map((tab) => (
                        <button
                            key={tab}
                            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab === 'overview' && <><FaChartBar /> Overview</>}
                            {tab === 'pending' && <><FaClock /> Pending ({pendingMaterials.length})</>}
                            {tab === 'users' && <><FaUsers /> Users ({allUsers.length})</>}
                        </button>
                    ))}
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && stats && (
                    <div className="dashboard-content">
                        <div className="stats-grid">
                            <div className="stat-card primary">
                                <div className="stat-card-icon"><FaBook /></div>
                                <div className="stat-card-info">
                                    <h3>{stats.totalMaterials}</h3>
                                    <p>Total Materials</p>
                                </div>
                            </div>
                            <div className="stat-card success">
                                <div className="stat-card-icon"><FaCheckCircle /></div>
                                <div className="stat-card-info">
                                    <h3>{stats.approvedMaterials}</h3>
                                    <p>Approved</p>
                                </div>
                            </div>
                            <div className="stat-card warning">
                                <div className="stat-card-icon"><FaClock /></div>
                                <div className="stat-card-info">
                                    <h3>{stats.pendingMaterials}</h3>
                                    <p>Pending</p>
                                </div>
                            </div>
                            <div className="stat-card info">
                                <div className="stat-card-icon"><FaUsers /></div>
                                <div className="stat-card-info">
                                    <h3>{stats.totalUsers}</h3>
                                    <p>Total Users</p>
                                </div>
                            </div>
                            <div className="stat-card accent">
                                <div className="stat-card-icon"><FaDownload /></div>
                                <div className="stat-card-info">
                                    <h3>{stats.totalDownloads}</h3>
                                    <p>Total Downloads</p>
                                </div>
                            </div>
                        </div>

                        {/* By Department */}
                        <div className="dashboard-section">
                            <h3>📊 Materials by Department</h3>
                            <div className="chart-bars">
                                {stats.byDepartment?.map((d) => (
                                    <div key={d._id} className="bar-row">
                                        <span className="bar-label">{d._id || 'Unknown'}</span>
                                        <div className="bar-track">
                                            <div
                                                className="bar-fill"
                                                style={{
                                                    width: `${Math.min((d.count / stats.totalMaterials) * 100, 100)}%`,
                                                }}
                                            />
                                        </div>
                                        <span className="bar-count">{d.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Uploads */}
                        <div className="dashboard-section">
                            <h3>🕐 Recent Uploads</h3>
                            <div className="recent-list">
                                {stats.recentUploads?.map((m) => (
                                    <div key={m._id} className="recent-item">
                                        <div>
                                            <Link to={`/materials/${m._id}`} className="recent-title">{m.title}</Link>
                                            <small>{m.semester} • {m.type} • by {m.uploadedBy?.name || 'Unknown'}</small>
                                        </div>
                                        <small>{new Date(m.createdAt).toLocaleDateString()}</small>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Pending Tab */}
                {activeTab === 'pending' && (
                    <div className="dashboard-content">
                        {pendingMaterials.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">✅</div>
                                <h4>No pending materials</h4>
                                <p>All materials have been reviewed</p>
                            </div>
                        ) : (
                            <div className="pending-list">
                                {pendingMaterials.map((m) => (
                                    <div key={m._id} className="pending-card">
                                        <div className="pending-info">
                                            <h4>{m.title}</h4>
                                            <p>{m.semester} • {m.type} • {m.department}</p>
                                            {m.description && <p className="pending-desc">{m.description}</p>}
                                            <div className="dept-tags">
                                                {m.subject?.map((s) => <span key={s} className="dept-tag">{s}</span>)}
                                            </div>
                                        </div>
                                        <div className="pending-actions">
                                            <Link to={`/materials/${m._id}`} className="action-btn-sm view">
                                                <FaEye />
                                            </Link>
                                            <button className="action-btn-sm approve" onClick={() => handleApprove(m._id, true)}>
                                                <FaCheck />
                                            </button>
                                            <button className="action-btn-sm reject" onClick={() => handleApprove(m._id, false)}>
                                                <FaTimes />
                                            </button>
                                            <button className="action-btn-sm delete" onClick={() => handleDeleteMaterial(m._id)}>
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="dashboard-content">
                        <div className="users-table-wrapper">
                            <table className="users-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Joined</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allUsers.map((u) => (
                                        <tr key={u._id}>
                                            <td>
                                                <div className="user-cell">
                                                    <div className="user-avatar-sm">{u.name?.charAt(0).toUpperCase()}</div>
                                                    {u.name}
                                                </div>
                                            </td>
                                            <td>{u.email}</td>
                                            <td>
                                                <span className={`role-tag ${u.role}`}>
                                                    {u.role === 'admin' ? <FaUserShield /> : <FaUserGraduate />}
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <div className="table-actions">
                                                    {u._id !== user?._id && (
                                                        <>
                                                            <button
                                                                className="action-btn-sm toggle-role"
                                                                onClick={() => handleRoleChange(u._id, u.role === 'admin' ? 'student' : 'admin')}
                                                                title={`Make ${u.role === 'admin' ? 'Student' : 'Admin'}`}
                                                            >
                                                                {u.role === 'admin' ? <FaUserGraduate /> : <FaUserShield />}
                                                            </button>
                                                            <button
                                                                className="action-btn-sm delete"
                                                                onClick={() => handleDeleteUser(u._id)}
                                                                title="Delete User"
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </>
                                                    )}
                                                    {u._id === user?._id && <span className="you-badge">You</span>}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
