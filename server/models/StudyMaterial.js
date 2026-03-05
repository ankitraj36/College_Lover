const mongoose = require('mongoose');

const studyMaterialSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    subject: { type: String, required: true },
    subjectRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    semester: { type: String, required: true },
    department: { type: String, required: true },
    departmentRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    type: { type: String, enum: ['PDF', 'PPT', 'DOCX', 'Textbook', 'Lab Manual', 'Other'], default: 'PDF' },
    size: { type: String, default: '' },
    fileURL: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    downloadCount: { type: Number, default: 0 },
}, { timestamps: true });

// Text index for search
studyMaterialSchema.index({ title: 'text', description: 'text', subject: 'text' });

module.exports = mongoose.model('StudyMaterial', studyMaterialSchema);
