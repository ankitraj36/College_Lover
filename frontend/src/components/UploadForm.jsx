import { useState } from 'react';
import { materialAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import {
    FaUpload,
    FaTimes,
    FaPlus,
} from 'react-icons/fa';

const departments = [
    'Computer Science',
    'CSIT',
    'AI & ML',
    'Data analytics',
    'IoT',
    'General',
];

const types = ['PDF', 'PPT', 'DOCX', 'Lab Manual', 'Textbook', 'Notes', 'Link'];

const semesters = [
    '1st Sem', '2nd Sem', '3rd Sem', '4th Sem',
    '5th Sem', '6th Sem', '7th Sem', '8th Sem',
];

const UploadForm = ({ onSuccess, onClose, editData = null }) => {
    const { isAdmin } = useAuth();
    const [formData, setFormData] = useState({
        title: editData?.title || '',
        subject: editData?.subject || [],
        semester: editData?.semester || '',
        department: editData?.department || '',
        description: editData?.description || '',
        type: editData?.type || 'PDF',
        size: editData?.size || '',
        fileUrl: editData?.fileUrl || '',
        courseCode: editData?.courseCode || '',
        credits: editData?.credits || '',
        gradingPattern: editData?.gradingPattern || '',
    });
    const [subjectInput, setSubjectInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const addSubject = () => {
        const s = subjectInput.trim();
        if (s && !formData.subject.includes(s)) {
            setFormData((prev) => ({ ...prev, subject: [...prev.subject, s] }));
            setSubjectInput('');
        }
    };

    const removeSubject = (s) => {
        setFormData((prev) => ({
            ...prev,
            subject: prev.subject.filter((x) => x !== s),
        }));
    };

    const validate = () => {
        const errs = {};
        if (!formData.title.trim()) errs.title = 'Title is required';
        if (formData.subject.length === 0) errs.subject = 'At least one subject required';
        if (!formData.semester) errs.semester = 'Semester is required';
        if (!formData.department) errs.department = 'Department is required';
        if (!formData.fileUrl.trim()) errs.fileUrl = 'File URL is required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            if (editData) {
                await materialAPI.update(editData._id, formData);
                toast.success('Material updated successfully!');
            } else {
                await materialAPI.create(formData);
                toast.success(
                    isAdmin
                        ? 'Material uploaded and approved!'
                        : 'Material uploaded! Pending admin approval.'
                );
            }
            if (onSuccess) onSuccess();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Upload failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="upload-form-overlay">
            <div className="upload-form-container">
                <div className="upload-form-header">
                    <h3>
                        <FaUpload /> {editData ? 'Edit Material' : 'Upload Material'}
                    </h3>
                    <button className="close-btn" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="upload-form">
                    <div className="form-grid">
                        <div className="form-group full-width">
                            <label htmlFor="title">Title *</label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g., Data Structures and Algorithms"
                                className={errors.title ? 'error' : ''}
                            />
                            {errors.title && <span className="error-text">{errors.title}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="semester">Semester *</label>
                            <select
                                id="semester"
                                name="semester"
                                value={formData.semester}
                                onChange={handleChange}
                                className={errors.semester ? 'error' : ''}
                            >
                                <option value="">Select Semester</option>
                                {semesters.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                            {errors.semester && <span className="error-text">{errors.semester}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="department">Department *</label>
                            <select
                                id="department"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                className={errors.department ? 'error' : ''}
                            >
                                <option value="">Select Department</option>
                                {departments.map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                            {errors.department && <span className="error-text">{errors.department}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="type">Type</label>
                            <select
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                            >
                                {types.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="size">File Size</label>
                            <input
                                id="size"
                                name="size"
                                type="text"
                                value={formData.size}
                                onChange={handleChange}
                                placeholder="e.g., 5.2 MB"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Subjects / Tags *</label>
                            <div className="subject-input-row">
                                <select
                                    value={subjectInput}
                                    onChange={(e) => setSubjectInput(e.target.value)}
                                >
                                    <option value="">Select a department tag</option>
                                    {departments.map((d) => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                                <button type="button" className="add-subject-btn" onClick={addSubject}>
                                    <FaPlus /> Add
                                </button>
                            </div>
                            <div className="subject-tags">
                                {formData.subject.map((s) => (
                                    <span key={s} className="subject-tag">
                                        {s}
                                        <button type="button" onClick={() => removeSubject(s)}>
                                            <FaTimes />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            {errors.subject && <span className="error-text">{errors.subject}</span>}
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="fileUrl">File URL / Link *</label>
                            <input
                                id="fileUrl"
                                name="fileUrl"
                                type="url"
                                value={formData.fileUrl}
                                onChange={handleChange}
                                placeholder="https://drive.google.com/..."
                                className={errors.fileUrl ? 'error' : ''}
                            />
                            {errors.fileUrl && <span className="error-text">{errors.fileUrl}</span>}
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Brief description of the material..."
                                rows="3"
                            />
                        </div>

                        {/* Academic Info Fields */}
                        <div className="form-group">
                            <label htmlFor="courseCode">Course Code</label>
                            <input
                                id="courseCode"
                                name="courseCode"
                                type="text"
                                value={formData.courseCode}
                                onChange={handleChange}
                                placeholder="e.g., CSE 3192"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="credits">Credits</label>
                            <input
                                id="credits"
                                name="credits"
                                type="number"
                                min="0"
                                max="10"
                                value={formData.credits}
                                onChange={handleChange}
                                placeholder="e.g., 4"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="gradingPattern">Grading Pattern</label>
                            <select
                                id="gradingPattern"
                                name="gradingPattern"
                                value={formData.gradingPattern}
                                onChange={handleChange}
                            >
                                <option value="">None</option>
                                <option value="1">Standard (Theory)</option>
                                <option value="2">Lab / Practical</option>
                                <option value="3">Project Based</option>
                                <option value="4">Seminar</option>
                                <option value="5">Combined (Theory + Lab)</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={loading}
                        >
                            {loading ? 'Uploading...' : editData ? 'Update' : 'Upload Material'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadForm;
