const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: '' },
    icon: { type: String, default: 'fa-graduation-cap' },
    color: { type: String, default: 'from-red-500 to-rose-600' },
}, { timestamps: true });

module.exports = mongoose.model('Department', departmentSchema);
