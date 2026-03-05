const Department = require('../models/Department');
const StudyMaterial = require('../models/StudyMaterial');

// GET /api/departments
exports.getAll = async (req, res) => {
    try {
        const departments = await Department.find().sort({ name: 1 });
        // Add material count for each department
        const result = await Promise.all(
            departments.map(async (dept) => {
                const count = await StudyMaterial.countDocuments({ department: dept.name });
                return { ...dept.toObject(), materialCount: count };
            })
        );
        res.json({ departments: result });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// GET /api/departments/:id
exports.getById = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }
        const materials = await StudyMaterial.find({ department: department.name });
        res.json({ department, materials });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// POST /api/departments — admin only
exports.create = async (req, res) => {
    try {
        const department = await Department.create(req.body);
        res.status(201).json({ department });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// PUT /api/departments/:id — admin only
exports.update = async (req, res) => {
    try {
        const department = await Department.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true,
        });
        if (!department) return res.status(404).json({ message: 'Department not found' });
        res.json({ department });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// DELETE /api/departments/:id — admin only
exports.remove = async (req, res) => {
    try {
        await Department.findByIdAndDelete(req.params.id);
        res.json({ message: 'Department deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
