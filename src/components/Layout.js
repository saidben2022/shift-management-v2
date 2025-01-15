import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate, Outlet } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "../context/AuthContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { LayoutDashboard, Users, Calendar, LogOut } from "lucide-react";
import "../styles/layout.css";
export default function Layout() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { t } = useTranslation();
    const handleLogout = () => {
        logout();
        navigate("/", { replace: true });
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("header", { className: "layout-header border-b border-gray-200 bg-white shadow-sm", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between items-center h-16", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "logo-container", children: _jsx("img", { src: "/logo.png", alt: "Workers Management System", className: "h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity", onClick: () => navigate("/dashboard") }) }), _jsxs("nav", { className: "hidden md:flex ml-8 space-x-2", children: [_jsxs(Button, { variant: "ghost", onClick: () => navigate("/dashboard"), className: "flex items-center gap-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors", children: [_jsx(LayoutDashboard, { className: "h-4 w-4" }), _jsx("span", { children: "Dashboard" })] }), _jsxs(Button, { variant: "ghost", onClick: () => navigate("/workers"), className: "flex items-center gap-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors", children: [_jsx(Users, { className: "h-4 w-4" }), _jsx("span", { children: t('navigation.workers') })] }), _jsxs(Button, { variant: "ghost", onClick: () => navigate("/shifts"), className: "flex items-center gap-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors", children: [_jsx(Calendar, { className: "h-4 w-4" }), _jsx("span", { children: t('navigation.shifts') })] })] })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx(LanguageSwitcher, {}), _jsxs(Button, { variant: "ghost", onClick: handleLogout, className: "flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors", children: [_jsx(LogOut, { className: "h-4 w-4" }), _jsx("span", { children: t('auth.logout') })] })] })] }) }) }), _jsx("main", { children: _jsx("div", { className: "max-w-full main-content", children: _jsx(Outlet, {}) }) })] }));
}
