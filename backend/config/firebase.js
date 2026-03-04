const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// In production, use a service account JSON file
// In development, you can use the project ID approach
const initFirebase = () => {
    if (admin.apps.length > 0) return admin;

    // Option 1: Use service account JSON (recommended for production)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    }
    // Option 2: Use just the project ID (simpler for development)
    else if (process.env.FIREBASE_PROJECT_ID) {
        admin.initializeApp({
            projectId: process.env.FIREBASE_PROJECT_ID,
        });
    }
    // Option 3: Default credentials (for Google Cloud environments)
    else {
        admin.initializeApp();
    }

    console.log('🔥 Firebase Admin SDK initialized');
    return admin;
};

initFirebase();

module.exports = admin;
