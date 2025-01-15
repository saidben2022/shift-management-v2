import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Loading } from "@/components/ui/loading";
const AuthContext = createContext(undefined);
export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const checkAuthStatus = async () => {
        try {
            const storedToken = localStorage.getItem('token');
            if (!storedToken) {
                setIsAuthenticated(false);
                setToken(null);
                return false;
            }
            // Verify token with backend
            const response = await api.get('/api/auth/verify');
            if (response.data?.valid) {
                setToken(storedToken);
                setIsAuthenticated(true);
                return true;
            }
            else {
                await logout();
                return false;
            }
        }
        catch (error) {
            console.error('Auth check failed:', error);
            await logout();
            return false;
        }
    };
    useEffect(() => {
        const initAuth = async () => {
            await checkAuthStatus();
            setIsLoading(false);
        };
        initAuth();
    }, []);
    const login = async (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setIsAuthenticated(true);
    };
    const logout = async () => {
        localStorage.removeItem('token');
        setToken(null);
        setIsAuthenticated(false);
    };
    if (isLoading) {
        return _jsx(Loading, { fullScreen: true });
    }
    return (_jsx(AuthContext.Provider, { value: { isAuthenticated, token, login, logout, checkAuthStatus }, children: children }));
}
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
