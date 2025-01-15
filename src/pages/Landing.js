import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { motion } from "framer-motion";
import { ChevronRight, Calendar, Bell, ArrowRight, Clock, BarChart3, Settings } from "lucide-react";
export default function Landing() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50/30", children: [_jsx("div", { className: "bg-white/80 backdrop-blur-sm border-b border-indigo-100 sticky top-0 z-50", children: _jsxs("div", { className: "container mx-auto px-4 py-4 flex justify-between items-center", children: [_jsx("div", { className: "flex items-center space-x-2", children: _jsx("img", { src: "/logo.png", alt: "Logo", className: "h-8 w-auto" }) }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx(LanguageSwitcher, {}), _jsx(Button, { onClick: () => navigate("/login"), className: "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-all duration-200", children: t('landing.getStarted') })] })] }) }), _jsxs("div", { className: "relative min-h-[600px] flex items-center justify-center overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-400 via-purple-500 to-pink-500 opacity-10" }), _jsx("div", { className: "relative z-10 container mx-auto px-4 py-20", children: _jsxs("div", { className: "max-w-3xl mx-auto text-center", children: [_jsx(motion.h1, { className: "text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600", initial: { y: 20, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { delay: 0.2 }, children: t('landing.title') }), _jsx(motion.p, { className: "text-xl text-indigo-600/80 mb-12", initial: { y: 20, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { delay: 0.4 }, children: t('landing.subtitle') }), _jsxs(motion.div, { initial: { y: 20, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { delay: 0.6 }, className: "flex flex-col sm:flex-row gap-4 justify-center", children: [_jsxs(Button, { onClick: () => navigate("/login"), className: "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 text-lg px-8 py-6 rounded-full group", size: "lg", children: [t('landing.getStarted'), _jsx(ChevronRight, { className: "ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" })] }), _jsxs(Button, { variant: "outline", onClick: () => navigate("/learn-more"), className: "border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50 transition-all duration-200 text-lg px-8 py-6 rounded-full group", size: "lg", children: [t('landing.learnMore'), _jsx(ArrowRight, { className: "ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" })] })] })] }) })] }), _jsx("div", { className: "py-20 bg-white/50 backdrop-blur-sm", children: _jsxs("div", { className: "container mx-auto px-4", children: [_jsx(motion.h2, { className: "text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, children: t('landing.features.title') }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: [_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.2 }, className: "group", children: _jsxs("div", { className: "bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-indigo-100 transition-all duration-300 hover:shadow-xl hover:scale-105 p-8", children: [_jsx("div", { className: "bg-gradient-to-br from-indigo-500 to-purple-500 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform", children: _jsx(Calendar, { className: "h-7 w-7 text-white" }) }), _jsx("h3", { className: "text-xl font-bold mb-3 text-indigo-900", children: t('landing.features.scheduling.title') }), _jsx("p", { className: "text-indigo-600/80", children: t('landing.features.scheduling.description') })] }) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.4 }, className: "group", children: _jsxs("div", { className: "bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-indigo-100 transition-all duration-300 hover:shadow-xl hover:scale-105 p-8", children: [_jsx("div", { className: "bg-gradient-to-br from-indigo-500 to-purple-500 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform", children: _jsx(Clock, { className: "h-7 w-7 text-white" }) }), _jsx("h3", { className: "text-xl font-bold mb-3 text-indigo-900", children: t('landing.features.attendance.title') }), _jsx("p", { className: "text-indigo-600/80", children: t('landing.features.attendance.description') })] }) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.6 }, className: "group", children: _jsxs("div", { className: "bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-indigo-100 transition-all duration-300 hover:shadow-xl hover:scale-105 p-8", children: [_jsx("div", { className: "bg-gradient-to-br from-indigo-500 to-purple-500 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform", children: _jsx(Bell, { className: "h-7 w-7 text-white" }) }), _jsx("h3", { className: "text-xl font-bold mb-3 text-indigo-900", children: t('landing.features.notifications.title') }), _jsx("p", { className: "text-indigo-600/80", children: t('landing.features.notifications.description') })] }) })] })] }) }), _jsx("div", { className: "py-20 bg-gradient-to-br from-indigo-500 to-purple-500", children: _jsxs("div", { className: "container mx-auto px-4", children: [_jsx(motion.h2, { className: "text-4xl font-bold text-center mb-16 text-white", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, children: t('landing.benefits.title') }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: [_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, className: "text-center group", children: _jsxs("div", { className: "bg-white/20 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/30 transition-all duration-300 h-full", children: [_jsx("div", { className: "bg-white/20 rounded-xl p-4 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform", children: _jsx(BarChart3, { className: "h-8 w-8 text-white" }) }), _jsx("h3", { className: "text-xl font-semibold text-white mb-4", children: t('landing.benefits.analytics.title') }), _jsx("p", { className: "text-indigo-100", children: t('landing.benefits.analytics.description') })] }) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.2 }, className: "text-center group", children: _jsxs("div", { className: "bg-white/20 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/30 transition-all duration-300 h-full", children: [_jsx("div", { className: "bg-white/20 rounded-xl p-4 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform", children: _jsx(Settings, { className: "h-8 w-8 text-white" }) }), _jsx("h3", { className: "text-xl font-semibold text-white mb-4", children: t('landing.benefits.automation.title') }), _jsx("p", { className: "text-indigo-100", children: t('landing.benefits.automation.description') })] }) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.4 }, className: "text-center group", children: _jsxs("div", { className: "bg-white/20 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/30 transition-all duration-300 h-full", children: [_jsx("div", { className: "bg-white/20 rounded-xl p-4 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform", children: _jsx(Clock, { className: "h-8 w-8 text-white" }) }), _jsx("h3", { className: "text-xl font-semibold text-white mb-4", children: t('landing.benefits.compliance.title') }), _jsx("p", { className: "text-indigo-100", children: t('landing.benefits.compliance.description') })] }) })] }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.6 }, className: "mt-12 text-center", children: _jsxs(Button, { onClick: () => navigate("/login"), className: "bg-white text-indigo-600 hover:bg-indigo-50 transition-all duration-200 text-lg px-8 py-6 rounded-full group", size: "lg", children: [t('landing.benefits.cta'), _jsx(ArrowRight, { className: "ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" })] }) })] }) })] }));
}