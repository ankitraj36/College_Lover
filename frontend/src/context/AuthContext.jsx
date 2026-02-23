import { createContext, useContext, useState, useEffect } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth as firebaseAuth, googleProvider, appleProvider } from '../config/firebase';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    // Load user on mount
    useEffect(() => {
        const loadUser = async () => {
            const savedToken = localStorage.getItem('token');
            if (savedToken) {
                try {
                    const { data } = await authAPI.getMe();
                    setUser(data.user);
                } catch {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setToken(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = async (credentials) => {
        const { data } = await authAPI.login(credentials);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        return data;
    };

    const register = async (userData) => {
        const { data } = await authAPI.register(userData);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        return data;
    };

    // ===== SOCIAL LOGIN (Firebase) =====
    const socialLogin = async (providerType) => {
        let provider;
        if (providerType === 'google') {
            provider = googleProvider;
        } else if (providerType === 'apple') {
            provider = appleProvider;
        } else {
            throw new Error(`Unsupported provider: ${providerType}`);
        }

        // Open Firebase OAuth popup
        const result = await signInWithPopup(firebaseAuth, provider);

        // Get the Firebase ID token
        const idToken = await result.user.getIdToken();

        // Send to our backend
        const { data } = await authAPI.socialLogin({ idToken });

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);

        return data;
    };

    const logout = async () => {
        try {
            await authAPI.logout();
        } catch {
            // ignore
        }
        // Also sign out of Firebase
        try {
            await firebaseAuth.signOut();
        } catch {
            // ignore
        }
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const isAdmin = user?.role === 'admin';
    const isAuthenticated = !!user && !!token;

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                isAdmin,
                isAuthenticated,
                login,
                register,
                socialLogin,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
