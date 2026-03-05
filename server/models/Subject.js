const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    semester: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
