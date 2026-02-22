import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBJhgQNnwVsTLZXTWsYml4beSaDQ4e2tuo",
    authDomain: "college-lover.firebaseapp.com",
    projectId: "college-lover",
    storageBucket: "college-lover.firebasestorage.app",
    messagingSenderId: "546102172381",
    appId: "1:546102172381:web:9607becc409164b6ef9934",
    measurementId: "G-G862FPYPN5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// Providers
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

const appleProvider = new OAuthProvider('apple.com');
appleProvider.addScope('email');
appleProvider.addScope('name');

export { auth, googleProvider, appleProvider };
export default app;
