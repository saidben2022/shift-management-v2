import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import Workers from "./pages/Workers";
import Shifts from "./pages/Shifts";
import LearnMore from "./pages/LearnMore";
import Layout from './components/Layout';
import { Toaster } from './components/ui/toaster';
import { useAuth } from './context/AuthContext';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CalendarPortal } from './components/CalendarPortal';
import "./styles/datepicker.css";
import './styles/calendar.css';
import './styles/calendar-portal.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './i18n';
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: false,
        },
    },
});
// Private Route wrapper component
const PrivateRoute = () => {
    const { isAuthenticated, checkAuthStatus } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        const verifyAuth = async () => {
            const isValid = await checkAuthStatus();
            if (!isValid) {
                navigate('/login', { state: { from: location.pathname } });
            }
        };
        verifyAuth();
    }, [location.pathname]);
    return isAuthenticated ? _jsx(Outlet, {}) : null;
};
function App() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        const publicPaths = ['/', '/login', '/register', '/learn-more'];
        if (isAuthenticated && location.pathname === '/login') {
            // If authenticated and on login page, redirect to dashboard
            navigate('/dashboard');
        }
    }, [isAuthenticated, location.pathname]);
    return (_jsx(QueryClientProvider, { client: queryClient, children: _jsxs("div", { className: "app", children: [_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Landing, {}) }), _jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/learn-more", element: _jsx(LearnMore, {}) }), _jsx(Route, { element: _jsx(PrivateRoute, {}), children: _jsxs(Route, { element: _jsx(Layout, {}), children: [_jsx(Route, { path: "/dashboard", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/workers", element: _jsx(Workers, {}) }), _jsx(Route, { path: "/shifts", element: _jsx(Shifts, {}) })] }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }), _jsx(Toaster, {}), _jsx(CalendarPortal, {})] }) }));
}
export default App;
