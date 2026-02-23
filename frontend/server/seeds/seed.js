/**
 * Seed script - populates MongoDB with initial data
 * Run: npm run seed
 */

const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const Material = require('../models/Material');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/college_lover');
        console.log('✅ MongoDB connected for seeding');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    }
};

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await User.deleteMany({});
        await Material.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Create admin user
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@collegelover.com',
            password: 'admin123',
            role: 'admin',
        });

        // Create student users
        const student1 = await User.create({
            name: 'Rahul Sharma',
            email: 'rahul@student.com',
            password: 'student123',
            role: 'student',
        });

        const student2 = await User.create({
            name: 'Priya Patel',
            email: 'priya@student.com',
            password: 'student123',
            role: 'student',
        });

        console.log('👤 Created users');

        // Create materials
        const materials = [
            {
                title: 'Game Programming with C++',
                subject: ['Computer Science'],
                semester: '6th Sem',
                department: 'Computer Science',
                description: 'Comprehensive guide to game programming using C++ covering game loops, rendering, and physics.',
                type: 'PDF',
                size: '2.5 MB',
                fileUrl: 'https://drive.google.com/drive/folders/1nrpDd0MCEH4oe50VXgnhY5TfABKx8v-b?usp=sharing',
                uploadedBy: admin._id,
                approved: true,
                downloads: 45,
            },
            {
                title: 'Introduction to Databases',
                subject: ['Computer Science', 'CSIT'],
                semester: '6th Sem',
                department: 'Computer Science',
                description: 'Core database concepts including SQL, normalization, ER diagrams, and relational algebra.',
                type: 'PDF',
                size: '4.2 MB',
                fileUrl: 'https://drive.google.com/drive/folders/1n4JpDbAgJciTKwQRz-BbClVTerhcVwfj?usp=drive_link',
                uploadedBy: admin._id,
                approved: true,
                downloads: 120,
            },
            {
                title: 'Computer Networking: Security',
                subject: ['IoT', 'Computer Science', 'AI & ML', 'Data analytics', 'CSIT'],
                semester: '6th Sem',
                department: 'Computer Science',
                description: 'Network security fundamentals, cryptography, firewalls, and intrusion detection systems.',
                type: 'PPT',
                size: '5.5 MB',
                fileUrl: 'https://drive.google.com/file/d/1gaG1XVzmb0KU652aeDrob4DZCp31mxJ9/view?usp=sharing',
                uploadedBy: admin._id,
                approved: true,
                downloads: 87,
            },
            {
                title: 'Python for Data Science 2',
                subject: ['Computer Science'],
                semester: '6th Sem',
                department: 'Computer Science',
                description: 'Advanced Python for data science: pandas, numpy, matplotlib, and machine learning libraries.',
                type: 'PPT',
                size: '3.1 MB',
                fileUrl: 'https://drive.google.com/drive/folders/1bmIb7mhjpvHe9Fy8htbmp8_7Zz0YQhAC?usp=sharing',
                uploadedBy: student1._id,
                approved: true,
                downloads: 65,
            },
            {
                title: 'Compilers: Principles & Tools (Book)',
                subject: ['Computer Science', 'CSIT'],
                semester: '6th Sem',
                department: 'Computer Science',
                description: 'The Dragon Book — covering lexical analysis, parsing, syntax-directed translation, and code optimization.',
                type: 'PDF',
                size: '12.0 MB',
                fileUrl: 'https://drive.google.com/file/d/1xbtb0fBLdZF8gUOg2AMi5O2XT1pKIPL2/view?usp=drive_link',
                uploadedBy: admin._id,
                approved: true,
                downloads: 200,
            },
            {
                title: 'Machine Learning Concepts 2',
                subject: ['Computer Science'],
                semester: '6th Sem',
                department: 'Computer Science',
                description: 'Advanced ML concepts: SVM, ensemble methods, neural networks, and model evaluation.',
                type: 'PDF',
                size: '3.8 MB',
                fileUrl: 'https://drive.google.com/file/d/1usXYJ_slN5XFI2m6_FUZFW_FhX_ALA8q/view?usp=drive_link',
                uploadedBy: student2._id,
                approved: true,
                downloads: 150,
            },
            {
                title: 'Robotics Programming Workshop 2',
                subject: ['IoT'],
                semester: '6th Sem',
                department: 'IoT',
                description: 'Hands-on robotics programming using Arduino, sensors, and motor control.',
                type: 'PDF',
                size: '10 MB',
                fileUrl: 'https://drive.google.com/file/d/1_h7wukHHa_i44__07ANkA_mX-PrCSDAX/view?usp=drive_link',
                uploadedBy: admin._id,
                approved: true,
                downloads: 34,
            },
            {
                title: 'Introduction to Disaster Management',
                subject: ['IoT'],
                semester: '6th Sem',
                department: 'IoT',
                description: 'Disaster management principles, early warning systems, and IoT applications in disaster response.',
                type: 'PDF',
                size: '4.2 MB',
                fileUrl: 'https://drive.google.com/file/d/1k93v1yeLhbh7JePLNhRASQ1bmpRUXygX/view?usp=drive_link',
                uploadedBy: student1._id,
                approved: true,
                downloads: 28,
            },
            {
                title: 'Deep Learning with TensorFlow',
                subject: ['AI & ML'],
                semester: '6th Sem',
                department: 'AI & ML',
                description: 'Deep learning fundamentals with TensorFlow: CNNs, RNNs, GANs, and transfer learning.',
                type: 'Textbook',
                size: '12 MB',
                fileUrl: 'https://drive.google.com/file/d/1Gl65xb-ZdAXNUglbOsDLalddU_HwKYir/view?usp=drive_link',
                uploadedBy: admin._id,
                approved: true,
                downloads: 190,
            },
            {
                title: 'Natural Language Processing',
                subject: ['AI & ML', 'Data analytics'],
                semester: '6th Sem',
                department: 'AI & ML',
                description: 'NLP techniques: tokenization, sentiment analysis, text classification, and transformers.',
                type: 'Textbook',
                size: '9 MB',
                fileUrl: 'https://drive.google.com/file/d/10n_h2cfv0t9KH9FVWz60sWo2gANCNB9k/view?usp=drive_link',
                uploadedBy: student2._id,
                approved: true,
                downloads: 110,
            },
            {
                title: 'Database Implementation in JDBC',
                subject: ['AI & ML', 'Data analytics', 'IoT'],
                semester: '6th Sem',
                department: 'General',
                description: 'JDBC connectivity, PreparedStatement, connection pooling, and transaction management.',
                type: 'Textbook',
                size: '19 MB',
                fileUrl: 'https://drive.google.com/file/d/1ZdnrlXmAholRMIjQIePIFRbx8fASAe4l/view?usp=drive_link',
                uploadedBy: admin._id,
                approved: true,
                downloads: 75,
            },
            {
                title: 'Web Development with Python and Django',
                subject: ['IoT'],
                semester: '6th Sem',
                department: 'IoT',
                description: 'Full-stack web development with Django: models, views, templates, REST APIs, and deployment.',
                type: 'Textbook',
                size: '15 MB',
                fileUrl: 'https://drive.google.com/file/d/1dogg4V-pgVBWy7v_K8NGegXig9ttvWIv/view?usp=drive_link',
                uploadedBy: student1._id,
                approved: true,
                downloads: 55,
            },
            {
                title: 'Database Management System Design',
                subject: ['AI & ML', 'Data analytics', 'IoT'],
                semester: '6th Sem',
                department: 'General',
                description: 'DBMS design principles: schema design, indexing strategies, query optimization, and NoSQL.',
                type: 'Textbook',
                size: '21 MB',
                fileUrl: 'https://drive.google.com/file/d/14O_eJe3xI7_UBjyhURdtICAVgRCiYsIh/view?usp=drive_link',
                uploadedBy: admin._id,
                approved: true,
                downloads: 92,
            },
            {
                title: 'Introduction to Macroeconomics',
                subject: ['AI & ML', 'Data analytics'],
                semester: '6th Sem',
                department: 'General',
                description: 'Macro-economic theory: GDP, inflation, monetary policy, and fiscal policy fundamentals.',
                type: 'Textbook',
                size: '8 MB',
                fileUrl: 'https://drive.google.com/drive/folders/1LSdZ31jcL28SE4gg7nDXtz7j-LhxKci5?usp=sharing',
                uploadedBy: student2._id,
                approved: true,
                downloads: 40,
            },
            {
                title: 'Big Data Analytics with Apache Spark',
                subject: ['Data analytics'],
                semester: '6th Sem',
                department: 'Data analytics',
                description: 'Big data processing with Spark: RDDs, DataFrames, Spark SQL, and MLlib.',
                type: 'Textbook',
                size: '14 MB',
                fileUrl: 'https://drive.google.com/file/d/1Lg5DJ1QtBlpWXdpi3eOtMq46gvRH4jIj/view?usp=sharing',
                uploadedBy: admin._id,
                approved: true,
                downloads: 68,
            },
            {
                title: 'Server Side Web Development with Node JS',
                subject: ['CSIT'],
                semester: '6th Sem',
                department: 'CSIT',
                description: 'The Node.js Platform, The Module System, Callbacks and Events, Asynchronous Control Flow Patterns with Callbacks, Promises and Async/Await, Coding with Streams, Creational, Structural and Behavioral Design Patterns, Universal JavaScript for Web Applications, Advanced Recipes, Scalability and Architectural Patterns, Messaging and Integration Patterns.',
                type: 'Textbook',
                size: '13 MB',
                fileUrl: 'https://drive.google.com/file/d/1-HfT32K2Xaid6I6qb2bPjtbFdXeDDfb1/view?usp=sharing',
                uploadedBy: admin._id,
                approved: true,
                downloads: 0,
                courseCode: 'CSE 3192',
                credits: 4,
                gradingPattern: 1,
            },
            {
                title: 'Machine Learning Algorithms with C++',
                subject: ['CSIT'],
                semester: '6th Sem',
                department: 'CSIT',
                description: 'Introduction to Machine Learning with C++, Data Processing, Measuring Performance and Selecting Models, Clustering, Anomaly Detection, Dimensionality Reduction, Classification, Recommender Systems, Ensemble Learning.',
                type: 'Textbook',
                size: '14 MB',
                fileUrl: 'https://drive.google.com/file/d/1VvwCO4kZ-x5bsUxaNI0gXbzHig7Sg9Dz/view?usp=sharing',
                uploadedBy: admin._id,
                approved: true,
                downloads: 0,
                courseCode: 'CSE 3374',
                credits: 3,
                gradingPattern: 2,
            },
            {
                title: 'Full-Stack Web Development with MERN',
                subject: ['CSIT'],
                semester: '6th Sem',
                department: 'CSIT',
                description: 'Understanding full-stack development to bridge frontend and backend. Building, testing, and deploying blog and chat applications using MongoDB, Express, React, and Node.js (MERN stack). Covers frontend and backend best practices, full-stack architectures, unit and end-to-end testing, and deployment of full-stack web applications (CH 1–CH 10, CH 11 and CH 12 if time permits).',
                type: 'Textbook',
                size: '15MB',
                fileUrl: 'https://drive.google.com/file/d/16aTZDrvKEVm9xChsgcbyCMOlMAlIbazQ/view?usp=sharing',
                uploadedBy: admin._id,
                approved: true,
                downloads: 0,
                courseCode: 'CSE 3839',
                credits: 2,
                gradingPattern: 5,
            },
        ];

        await Material.insertMany(materials);
        console.log(`📚 Created ${materials.length} materials`);

        console.log('\n✅ Seed completed successfully!');
        console.log('\n📝 Login Credentials:');
        console.log('   Admin: admin@collegelover.com / admin123');
        console.log('   Student: rahul@student.com / student123');
        console.log('   Student: priya@student.com / student123\n');

        process.exit(0);
    } catch (err) {
        console.error('❌ Seed error:', err);
        process.exit(1);
    }
};

seedData();
