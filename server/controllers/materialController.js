const StudyMaterial = require('../models/StudyMaterial');

// GET /api/materials — list all (with filters)
exports.getAll = async (req, res) => {
    try {
        const { department, semester, subject, search, page = 1, limit = 20 } = req.query;
        const filter = {};

        if (department) filter.department = department;
        if (semester) filter.semester = { $regex: semester, $options: 'i' };
        if (subject) filter.subject = { $regex: subject, $options: 'i' };
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { subject: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await StudyMaterial.countDocuments(filter);
        const materials = await StudyMaterial.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('uploadedBy', 'name');

        res.json({
            materials,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit)),
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// GET /api/materials/:id
exports.getById = async (req, res) => {
    try {
        const material = await StudyMaterial.findById(req.params.id).populate('uploadedBy', 'name');
        if (!material) {
            return res.status(404).json({ message: 'Material not found' });
        }
        res.json({ material });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// POST /api/materials — admin only
exports.create = async (req, res) => {
    try {
        const material = await StudyMaterial.create({
            ...req.body,
            uploadedBy: req.user._id,
        });
        res.status(201).json({ material });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// PUT /api/materials/:id — admin only
exports.update = async (req, res) => {
    try {
        const material = await StudyMaterial.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!material) {
            return res.status(404).json({ message: 'Material not found' });
        }
        res.json({ material });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// DELETE /api/materials/:id — admin only
exports.remove = async (req, res) => {
    try {
        const material = await StudyMaterial.findByIdAndDelete(req.params.id);
        if (!material) {
            return res.status(404).json({ message: 'Material not found' });
        }
        res.json({ message: 'Material deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// POST /api/materials/:id/download — increment download count
exports.download = async (req, res) => {
    try {
        const material = await StudyMaterial.findByIdAndUpdate(
            req.params.id,
            { $inc: { downloadCount: 1 } },
            { new: true }
        );
        if (!material) {
            return res.status(404).json({ message: 'Material not found' });
        }
        res.json({ fileURL: material.fileURL, downloadCount: material.downloadCount });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// GET /api/materials/stats — aggregate stats
exports.getStats = async (req, res) => {
    try {
        const totalMaterials = await StudyMaterial.countDocuments();
        const stats = await StudyMaterial.aggregate([
            { $group: { _id: null, totalDownloads: { $sum: '$downloadCount' } } },
        ]);
        const departments = await StudyMaterial.distinct('department');

        res.json({
            totalMaterials,
            totalDownloads: stats[0]?.totalDownloads || 0,
            totalDepartments: departments.length,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
