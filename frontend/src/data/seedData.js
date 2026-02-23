/**
 * Seed Data — Frontend-compatible static data
 * Mirrors the backend seed.js so the frontend can work offline / in dev mode.
 *
 * Every object uses the same shape the API returns (including _id, uploadedBy
 * populated as { _id, name, email }, timestamps, likes[], comments[], etc.).
 */

// ─── Users ───────────────────────────────────────────────────────────────────

export const users = {
    admin: {
        _id: 'seed_admin_001',
        name: 'Admin User',
        email: 'admin@collegelover.com',
        role: 'admin',
        avatar: '',
        bookmarks: [],
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
    },
    student1: {
        _id: 'seed_student_001',
        name: 'Rahul Sharma',
        email: 'rahul@student.com',
        role: 'student',
        avatar: '',
        bookmarks: [],
        createdAt: '2026-01-02T00:00:00.000Z',
        updatedAt: '2026-01-02T00:00:00.000Z',
    },
    student2: {
        _id: 'seed_student_002',
        name: 'Priya Patel',
        email: 'priya@student.com',
        role: 'student',
        avatar: '',
        bookmarks: [],
        createdAt: '2026-01-03T00:00:00.000Z',
        updatedAt: '2026-01-03T00:00:00.000Z',
    },
};

// Shorthand references
const admin = { _id: users.admin._id, name: users.admin.name, email: users.admin.email };
const student1 = { _id: users.student1._id, name: users.student1.name, email: users.student1.email };
const student2 = { _id: users.student2._id, name: users.student2.name, email: users.student2.email };

// ─── Materials ───────────────────────────────────────────────────────────────

export const materials = [
    {
        _id: 'seed_mat_001',
        title: 'Game Programming with C++',
        subject: ['Computer Science'],
        semester: '6th Sem',
        department: 'Computer Science',
        description:
            'Comprehensive guide to game programming using C++ covering game loops, rendering, and physics.',
        type: 'PDF',
        size: '2.5 MB',
        fileUrl:
            'https://drive.google.com/drive/folders/1nrpDd0MCEH4oe50VXgnhY5TfABKx8v-b?usp=sharing',
        uploadedBy: admin,
        approved: true,
        downloads: 45,
        courseCode: '',
        credits: 0,
        gradingPattern: 0,
        likes: [],
        comments: [],
        createdAt: '2026-01-10T08:00:00.000Z',
        updatedAt: '2026-01-10T08:00:00.000Z',
    },
    {
        _id: 'seed_mat_002',
        title: 'Introduction to Databases',
        subject: ['Computer Science', 'CSIT'],
        semester: '6th Sem',
        department: 'Computer Science',
        description:
            'Core database concepts including SQL, normalization, ER diagrams, and relational algebra.',
        type: 'PDF',
        size: '4.2 MB',
        fileUrl:
            'https://drive.google.com/drive/folders/1n4JpDbAgJciTKwQRz-BbClVTerhcVwfj?usp=drive_link',
        uploadedBy: admin,
        approved: true,
        downloads: 120,
        courseCode: '',
        credits: 0,
        gradingPattern: 0,
        likes: [],
        comments: [],
        createdAt: '2026-01-10T09:00:00.000Z',
        updatedAt: '2026-01-10T09:00:00.000Z',
    },
    {
        _id: 'seed_mat_003',
        title: 'Computer Networking: Security',
        subject: ['IoT', 'Computer Science', 'AI & ML', 'Data analytics', 'CSIT'],
        semester: '6th Sem',
        department: 'Computer Science',
        description:
            'Network security fundamentals, cryptography, firewalls, and intrusion detection systems.',
        type: 'PPT',
        size: '5.5 MB',
        fileUrl:
            'https://drive.google.com/file/d/1gaG1XVzmb0KU652aeDrob4DZCp31mxJ9/view?usp=sharing',
        uploadedBy: admin,
        approved: true,
        downloads: 87,
        courseCode: '',
        credits: 0,
        gradingPattern: 0,
        likes: [],
        comments: [],
        createdAt: '2026-01-10T10:00:00.000Z',
        updatedAt: '2026-01-10T10:00:00.000Z',
    },
    {
        _id: 'seed_mat_004',
        title: 'Python for Data Science 2',
        subject: ['Computer Science'],
        semester: '6th Sem',
        department: 'Computer Science',
        description:
            'Advanced Python for data science: pandas, numpy, matplotlib, and machine learning libraries.',
        type: 'PPT',
        size: '3.1 MB',
        fileUrl:
            'https://drive.google.com/drive/folders/1bmIb7mhjpvHe9Fy8htbmp8_7Zz0YQhAC?usp=sharing',
        uploadedBy: student1,
        approved: true,
        downloads: 65,
        courseCode: '',
        credits: 0,
        gradingPattern: 0,
        likes: [],
        comments: [],
        createdAt: '2026-01-11T08:00:00.000Z',
        updatedAt: '2026-01-11T08:00:00.000Z',
    },
    {
        _id: 'seed_mat_005',
        title: 'Compilers: Principles & Tools (Book)',
        subject: ['Computer Science', 'CSIT'],
        semester: '6th Sem',
        department: 'Computer Science',
        description:
            'The Dragon Book — covering lexical analysis, parsing, syntax-directed translation, and code optimization.',
        type: 'PDF',
        size: '12.0 MB',
        fileUrl:
            'https://drive.google.com/file/d/1xbtb0fBLdZF8gUOg2AMi5O2XT1pKIPL2/view?usp=drive_link',
        uploadedBy: admin,
        approved: true,
        downloads: 200,
        courseCode: '',
        credits: 0,
        gradingPattern: 0,
        likes: [],
        comments: [],
        createdAt: '2026-01-11T09:00:00.000Z',
        updatedAt: '2026-01-11T09:00:00.000Z',
    },
    {
        _id: 'seed_mat_006',
        title: 'Machine Learning Concepts 2',
        subject: ['Computer Science'],
        semester: '6th Sem',
        department: 'Computer Science',
        description:
            'Advanced ML concepts: SVM, ensemble methods, neural networks, and model evaluation.',
        type: 'PDF',
        size: '3.8 MB',
        fileUrl:
            'https://drive.google.com/file/d/1usXYJ_slN5XFI2m6_FUZFW_FhX_ALA8q/view?usp=drive_link',
        uploadedBy: student2,
        approved: true,
        downloads: 150,
        courseCode: '',
        credits: 0,
        gradingPattern: 0,
        likes: [],
        comments: [],
        createdAt: '2026-01-12T08:00:00.000Z',
        updatedAt: '2026-01-12T08:00:00.000Z',
    },
    {
        _id: 'seed_mat_007',
        title: 'Robotics Programming Workshop 2',
        subject: ['IoT'],
        semester: '6th Sem',
        department: 'IoT',
        description:
            'Hands-on robotics programming using Arduino, sensors, and motor control.',
        type: 'PDF',
        size: '10 MB',
        fileUrl:
            'https://drive.google.com/file/d/1_h7wukHHa_i44__07ANkA_mX-PrCSDAX/view?usp=drive_link',
        uploadedBy: admin,
        approved: true,
        downloads: 34,
        courseCode: '',
        credits: 0,
        gradingPattern: 0,
        likes: [],
        comments: [],
        createdAt: '2026-01-12T09:00:00.000Z',
        updatedAt: '2026-01-12T09:00:00.000Z',
    },
    {
        _id: 'seed_mat_008',
        title: 'Introduction to Disaster Management',
        subject: ['IoT'],
        semester: '6th Sem',
        department: 'IoT',
        description:
            'Disaster management principles, early warning systems, and IoT applications in disaster response.',
        type: 'PDF',
        size: '4.2 MB',
        fileUrl:
            'https://drive.google.com/file/d/1k93v1yeLhbh7JePLNhRASQ1bmpRUXygX/view?usp=drive_link',
        uploadedBy: student1,
        approved: true,
        downloads: 28,
        courseCode: '',
        credits: 0,
        gradingPattern: 0,
        likes: [],
        comments: [],
        createdAt: '2026-01-13T08:00:00.000Z',
        updatedAt: '2026-01-13T08:00:00.000Z',
    },
    {
        _id: 'seed_mat_009',
        title: 'Deep Learning with TensorFlow',
        subject: ['AI & ML'],
        semester: '6th Sem',
        department: 'AI & ML',
        description:
            'Deep learning fundamentals with TensorFlow: CNNs, RNNs, GANs, and transfer learning.',
        type: 'Textbook',
        size: '12 MB',
        fileUrl:
            'https://drive.google.com/file/d/1Gl65xb-ZdAXNUglbOsDLalddU_HwKYir/view?usp=drive_link',
        uploadedBy: admin,
        approved: true,
        downloads: 190,
        courseCode: '',
        credits: 0,
        gradingPattern: 0,
        likes: [],
        comments: [],
        createdAt: '2026-01-13T09:00:00.000Z',
        updatedAt: '2026-01-13T09:00:00.000Z',
    },
    {
        _id: 'seed_mat_010',
        title: 'Natural Language Processing',
        subject: ['AI & ML', 'Data analytics'],
        semester: '6th Sem',
        department: 'AI & ML',
        description:
            'NLP techniques: tokenization, sentiment analysis, text classification, and transformers.',
        type: 'Textbook',
        size: '9 MB',
        fileUrl:
            'https://drive.google.com/file/d/10n_h2cfv0t9KH9FVWz60sWo2gANCNB9k/view?usp=drive_link',
        uploadedBy: student2,
        approved: true,
        downloads: 110,
        courseCode: '',
        credits: 0,
        gradingPattern: 0,
        likes: [],
        comments: [],
        createdAt: '2026-01-14T08:00:00.000Z',
        updatedAt: '2026-01-14T08:00:00.000Z',
    },
    {
        _id: 'seed_mat_011',
        title: 'Database Implementation in JDBC',
        subject: ['AI & ML', 'Data analytics', 'IoT'],
        semester: '6th Sem',
        department: 'General',
        description:
            'JDBC connectivity, PreparedStatement, connection pooling, and transaction management.',
        type: 'Textbook',
        size: '19 MB',
        fileUrl:
            'https://drive.google.com/file/d/1ZdnrlXmAholRMIjQIePIFRbx8fASAe4l/view?usp=drive_link',
        uploadedBy: admin,
        approved: true,
        downloads: 75,
        courseCode: '',
        credits: 0,
        gradingPattern: 0,
        likes: [],
        comments: [],
        createdAt: '2026-01-14T09:00:00.000Z',
        updatedAt: '2026-01-14T09:00:00.000Z',
    },
    {
        _id: 'seed_mat_012',
        title: 'Web Development with Python and Django',
        subject: ['IoT'],
        semester: '6th Sem',
        department: 'IoT',
        description:
            'Full-stack web development with Django: models, views, templates, REST APIs, and deployment.',
        type: 'Textbook',
        size: '15 MB',
        fileUrl:
            'https://drive.google.com/file/d/1dogg4V-pgVBWy7v_K8NGegXig9ttvWIv/view?usp=drive_link',
        uploadedBy: student1,
        approved: true,
        downloads: 55,
        courseCode: '',
        credits: 0,
        gradingPattern: 0,
        likes: [],
        comments: [],
        createdAt: '2026-01-15T08:00:00.000Z',
        updatedAt: '2026-01-15T08:00:00.000Z',
    },
    {
        _id: 'seed_mat_013',
        title: 'Database Management System Design',
        subject: ['AI & ML', 'Data analytics', 'IoT'],
        semester: '6th Sem',
        department: 'General',
        description:
            'DBMS design principles: schema design, indexing strategies, query optimization, and NoSQL.',
        type: 'Textbook',
        size: '21 MB',
        fileUrl:
            'https://drive.google.com/file/d/14O_eJe3xI7_UBjyhURdtICAVgRCiYsIh/view?usp=drive_link',
        uploadedBy: admin,
        approved: true,
        downloads: 92,
        courseCode: '',
        credits: 0,
        gradingPattern: 0,
        likes: [],
        comments: [],
        createdAt: '2026-01-15T09:00:00.000Z',
        updatedAt: '2026-01-15T09:00:00.000Z',
    },
    {
        _id: 'seed_mat_014',
        title: 'Introduction to Macroeconomics',
        subject: ['AI & ML', 'Data analytics'],
        semester: '6th Sem',
        department: 'General',
        description:
            'Macro-economic theory: GDP, inflation, monetary policy, and fiscal policy fundamentals.',
        type: 'Textbook',
        size: '8 MB',
        fileUrl:
            'https://drive.google.com/drive/folders/1LSdZ31jcL28SE4gg7nDXtz7j-LhxKci5?usp=sharing',
        uploadedBy: student2,
        approved: true,
        downloads: 40,
        courseCode: '',
        credits: 0,
        gradingPattern: 0,
        likes: [],
        comments: [],
        createdAt: '2026-01-16T08:00:00.000Z',
        updatedAt: '2026-01-16T08:00:00.000Z',
    },
    {
        _id: 'seed_mat_015',
        title: 'Big Data Analytics with Apache Spark',
        subject: ['Data analytics'],
        semester: '6th Sem',
        department: 'Data analytics',
        description:
            'Big data processing with Spark: RDDs, DataFrames, Spark SQL, and MLlib.',
        type: 'Textbook',
        size: '14 MB',
        fileUrl:
            'https://drive.google.com/file/d/1Lg5DJ1QtBlpWXdpi3eOtMq46gvRH4jIj/view?usp=sharing',
        uploadedBy: admin,
        approved: true,
        downloads: 68,
        courseCode: '',
        credits: 0,
        gradingPattern: 0,
        likes: [],
        comments: [],
        createdAt: '2026-01-16T09:00:00.000Z',
        updatedAt: '2026-01-16T09:00:00.000Z',
    },
    {
        _id: 'seed_mat_016',
        title: 'Server Side Web Development with Node JS',
        subject: ['CSIT'],
        semester: '6th Sem',
        department: 'CSIT',
        description:
            'The Node.js Platform, The Module System, Callbacks and Events, Asynchronous Control Flow Patterns with Callbacks, Promises and Async/Await, Coding with Streams, Creational, Structural and Behavioral Design Patterns, Universal JavaScript for Web Applications, Advanced Recipes, Scalability and Architectural Patterns, Messaging and Integration Patterns.',
        type: 'Textbook',
        size: '13 MB',
        fileUrl:
            'https://drive.google.com/file/d/1-HfT32K2Xaid6I6qb2bPjtbFdXeDDfb1/view?usp=sharing',
        uploadedBy: admin,
        approved: true,
        downloads: 0,
        courseCode: 'CSE 3192',
        credits: 4,
        gradingPattern: 1,
        likes: [],
        comments: [],
        createdAt: '2026-01-17T08:00:00.000Z',
        updatedAt: '2026-01-17T08:00:00.000Z',
    },
    {
        _id: 'seed_mat_017',
        title: 'Machine Learning Algorithms with C++',
        subject: ['CSIT'],
        semester: '6th Sem',
        department: 'CSIT',
        description:
            'Introduction to Machine Learning with C++, Data Processing, Measuring Performance and Selecting Models, Clustering, Anomaly Detection, Dimensionality Reduction, Classification, Recommender Systems, Ensemble Learning.',
        type: 'Textbook',
        size: '14 MB',
        fileUrl:
            'https://drive.google.com/file/d/1VvwCO4kZ-x5bsUxaNI0gXbzHig7Sg9Dz/view?usp=sharing',
        uploadedBy: admin,
        approved: true,
        downloads: 0,
        courseCode: 'CSE 3374',
        credits: 3,
        gradingPattern: 2,
        likes: [],
        comments: [],
        createdAt: '2026-01-17T09:00:00.000Z',
        updatedAt: '2026-01-17T09:00:00.000Z',
    },
    {
        _id: 'seed_mat_018',
        title: 'Full-Stack Web Development with MERN',
        subject: ['CSIT'],
        semester: '6th Sem',
        department: 'CSIT',
        description:
            'Understanding full-stack development to bridge frontend and backend. Building, testing, and deploying blog and chat applications using MongoDB, Express, React, and Node.js (MERN stack). Covers frontend and backend best practices, full-stack architectures, unit and end-to-end testing, and deployment of full-stack web applications (CH 1–CH 10, CH 11 and CH 12 if time permits).',
        type: 'Textbook',
        size: '15MB',
        fileUrl:
            'https://drive.google.com/file/d/16aTZDrvKEVm9xChsgcbyCMOlMAlIbazQ/view?usp=sharing',
        uploadedBy: admin,
        approved: true,
        downloads: 0,
        courseCode: 'CSE 3839',
        credits: 2,
        gradingPattern: 5,
        likes: [],
        comments: [],
        createdAt: '2026-01-18T08:00:00.000Z',
        updatedAt: '2026-01-18T08:00:00.000Z',
    },
];

// ─── Helper Constants ────────────────────────────────────────────────────────

export const departments = [
    'Computer Science',
    'CSIT',
    'AI & ML',
    'Data analytics',
    'IoT',
    'General',
];

export const materialTypes = [
    'PDF',
    'PPT',
    'DOCX',
    'Lab Manual',
    'Textbook',
    'Notes',
    'Link',
];

export const semesters = [
    '1st Sem',
    '2nd Sem',
    '3rd Sem',
    '4th Sem',
    '5th Sem',
    '6th Sem',
    '7th Sem',
    '8th Sem',
];

export const gradingLabels = {
    1: 'Standard (Theory)',
    2: 'Lab / Practical',
    3: 'Project Based',
    4: 'Seminar',
    5: 'Combined (Theory + Lab)',
};

// ─── Helper Functions ────────────────────────────────────────────────────────

/** Look up a single material by its _id */
export const getMaterialById = (id) => materials.find((m) => m._id === id) || null;

/** Filter materials by subject / department name */
export const getMaterialsBySubject = (subject) =>
    materials.filter((m) =>
        Array.isArray(m.subject) ? m.subject.includes(subject) : m.subject === subject,
    );

/** Filter materials by semester string, e.g. '6th Sem' */
export const getMaterialsBySemester = (semester) =>
    materials.filter((m) => m.semester === semester);

/** Filter materials by type, e.g. 'PDF' */
export const getMaterialsByType = (type) =>
    materials.filter((m) => m.type === type);

/** Search materials by title or description (case-insensitive) */
export const searchMaterials = (query) => {
    const q = query.toLowerCase().trim();
    if (!q) return materials;
    return materials.filter(
        (m) =>
            m.title.toLowerCase().includes(q) ||
            m.description.toLowerCase().includes(q) ||
            (Array.isArray(m.subject)
                ? m.subject.some((s) => s.toLowerCase().includes(q))
                : (m.subject || '').toLowerCase().includes(q)),
    );
};

/** Get user list (as array) */
export const getUserList = () => Object.values(users);

/** Login credentials for reference */
export const loginCredentials = [
    { role: 'Admin', email: 'admin@collegelover.com', password: 'admin123' },
    { role: 'Student', email: 'rahul@student.com', password: 'student123' },
    { role: 'Student', email: 'priya@student.com', password: 'student123' },
];

// Default export for convenience
export default {
    users,
    materials,
    departments,
    materialTypes,
    semesters,
    gradingLabels,
    getMaterialById,
    getMaterialsBySubject,
    getMaterialsBySemester,
    getMaterialsByType,
    searchMaterials,
    getUserList,
    loginCredentials,
};
