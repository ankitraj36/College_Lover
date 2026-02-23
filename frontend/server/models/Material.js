const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please provide a title'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        subject: {
            type: [String],
            required: [true, 'Please provide at least one subject/department'],
            validate: {
                validator: function (v) {
                    return v && v.length > 0;
                },
                message: 'At least one subject/department is required',
            },
        },
        semester: {
            type: String,
            required: [true, 'Please provide the semester'],
            trim: true,
        },
        department: {
            type: String,
            required: [true, 'Please provide a department'],
            enum: [
                'Computer Science',
                'CSIT',
                'AI & ML',
                'Data analytics',
                'IoT',
                'General',
            ],
            default: 'General',
        },
        description: {
            type: String,
            default: '',
            maxlength: [1000, 'Description cannot exceed 1000 characters'],
        },
        type: {
            type: String,
            enum: ['PDF', 'PPT', 'DOCX', 'Lab Manual', 'Textbook', 'Notes', 'Link'],
            default: 'PDF',
        },
        size: {
            type: String,
            default: 'N/A',
        },
        courseCode: {
            type: String,
            default: '',
        },
        credits: {
            type: Number,
            default: 0,
        },
        gradingPattern: {
            type: Number,
            default: 0,
        },
        fileUrl: {
            type: String,
            required: [true, 'Please provide a file URL or link'],
        },
        links: [
            {
                name: { type: String },
                url: { type: String },
            },
        ],
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        approved: {
            type: Boolean,
            default: false,
        },
        downloads: {
            type: Number,
            default: 0,
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        comments: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
                text: {
                    type: String,
                    required: true,
                    maxlength: 500,
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Indexes for search & filter performance
MaterialSchema.index({ subject: 1 });
MaterialSchema.index({ semester: 1 });
MaterialSchema.index({ department: 1 });
MaterialSchema.index({ approved: 1 });
MaterialSchema.index({ title: 'text', description: 'text' });
MaterialSchema.index({ createdAt: -1 });

// Virtual for like count
MaterialSchema.virtual('likeCount').get(function () {
    return this.likes ? this.likes.length : 0;
});

// Virtual for comment count
MaterialSchema.virtual('commentCount').get(function () {
    return this.comments ? this.comments.length : 0;
});

module.exports = mongoose.model('Material', MaterialSchema);
