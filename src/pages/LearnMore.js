import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Users, Calendar, ChevronRight, Settings, CheckCircle, LayoutDashboard, ClipboardList, Zap, FolderCheck, Globe } from "lucide-react";
export default function LearnMore() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3
            }
        }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6
            }
        }
    };
    const FeatureCard = ({ title, description, details = [], icon: Icon, delay = 0 }) => {
        const [ref, inView] = useInView({
            triggerOnce: true,
            threshold: 0.1
        });
        return (_jsx(motion.div, { ref: ref, initial: { opacity: 0, y: 20 }, animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }, transition: { duration: 0.6, delay }, className: "bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-indigo-100", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-start space-x-4", children: [_jsx("div", { className: "bg-gradient-to-br from-indigo-500 to-purple-500 p-3 rounded-lg", children: _jsx(Icon, { className: "h-6 w-6 text-white" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2 text-indigo-900", children: title }), _jsx("p", { className: "text-indigo-600/80", children: description })] })] }), Array.isArray(details) && details.length > 0 && (_jsx("ul", { className: "space-y-2 ml-14", children: details.map((detail, index) => (_jsxs("li", { className: "flex items-center text-sm text-indigo-600/80", children: [_jsx(CheckCircle, { className: "h-4 w-4 text-indigo-500 mr-2" }), detail] }, index))) }))] }) }));
    };
    const StepCard = ({ number, title, description, details, icon: Icon, delay = 0 }) => {
        const [ref, inView] = useInView({
            triggerOnce: true,
            threshold: 0.1
        });
        return (_jsxs(motion.div, { ref: ref, initial: { opacity: 0, x: -50 }, animate: inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }, transition: { duration: 0.6, delay }, className: "flex items-start space-x-4 bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-indigo-100", children: [_jsx("div", { className: "flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-full flex items-center justify-center font-bold", children: number }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [_jsx(Icon, { className: "h-6 w-6 text-indigo-500" }), _jsx("h3", { className: "text-xl font-semibold text-indigo-900", children: title })] }), _jsx("p", { className: "text-indigo-600/80 mb-4", children: description }), _jsx("p", { className: "text-sm text-indigo-500/70", children: details })] })] }));
    };
    const BenefitCard = ({ icon: Icon, title, description, delay = 0 }) => {
        const [ref, inView] = useInView({
            triggerOnce: true,
            threshold: 0.1
        });
        return (_jsxs(motion.div, { ref: ref, initial: { opacity: 0, scale: 0.9 }, animate: inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }, transition: { duration: 0.4, delay }, className: "bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-indigo-100", children: [_jsx("div", { className: "bg-gradient-to-br from-indigo-500 to-purple-500 p-3 rounded-lg inline-block mb-4", children: _jsx(Icon, { className: "h-6 w-6 text-white" }) }), _jsx("h3", { className: "text-lg font-semibold mb-2 text-indigo-900", children: title }), _jsx("p", { className: "text-indigo-600/80", children: description })] }));
    };
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50/30", children: [_jsx("div", { className: "bg-white/80 backdrop-blur-sm border-b border-indigo-100", children: _jsxs("div", { className: "container mx-auto px-4 py-4 flex justify-between items-center", children: [_jsx("div", { className: "flex items-center space-x-2", children: _jsx("img", { src: "/logo.png", alt: "Logo", className: "h-8 w-auto" }) }), _jsx(LanguageSwitcher, {})] }) }), _jsx(motion.div, { className: "bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-20", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 1 }, children: _jsx("div", { className: "container mx-auto px-4", children: _jsxs("div", { className: "max-w-3xl mx-auto text-center", children: [_jsx(motion.h1, { className: "text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-100", initial: { y: 20, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { delay: 0.2 }, children: t('learnMore.title') }), _jsx(motion.p, { className: "text-xl text-indigo-100 mb-8", initial: { y: 20, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { delay: 0.4 }, children: t('learnMore.subtitle') }), _jsx(motion.div, { initial: { y: 20, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { delay: 0.6 }, children: _jsxs(Button, { onClick: () => navigate("/login"), className: "bg-white text-indigo-600 hover:bg-indigo-50 transition-colors duration-200", size: "lg", children: [t('learnMore.getStarted'), " ", _jsx(ChevronRight, { className: "ml-2 h-4 w-4" })] }) })] }) }) }), _jsx(motion.section, { className: "py-20", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 1 }, children: _jsxs("div", { className: "container mx-auto px-4", children: [_jsx("div", { className: "text-center mb-12", children: _jsx(motion.h2, { className: "text-3xl font-bold mb-4", initial: { y: 20, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { delay: 0.2 }, children: t('learnMore.features.title') }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto", children: [_jsx(FeatureCard, { icon: Users, title: t('learnMore.features.workers.title'), description: t('learnMore.features.workers.description'), details: t('learnMore.features.workers.details', { returnObjects: true }), delay: 0.2 }), _jsx(FeatureCard, { icon: Calendar, title: t('learnMore.features.scheduling.title'), description: t('learnMore.features.scheduling.description'), details: t('learnMore.features.scheduling.details', { returnObjects: true }), delay: 0.3 }), _jsx(FeatureCard, { icon: LayoutDashboard, title: t('learnMore.features.dashboard.title'), description: t('learnMore.features.dashboard.description'), details: t('learnMore.features.dashboard.details', { returnObjects: true }), delay: 0.4 })] })] }) }), _jsx(motion.section, { className: "py-20 bg-gray-50", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 1 }, children: _jsxs("div", { className: "container mx-auto px-4", children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx(motion.h2, { className: "text-3xl font-bold mb-4", initial: { y: 20, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { delay: 0.2 }, children: t('learnMore.howItWorks.title') }), _jsx(motion.p, { className: "text-xl text-gray-600", initial: { y: 20, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { delay: 0.3 }, children: t('learnMore.howItWorks.subtitle') })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto", children: [_jsx(StepCard, { number: "1", icon: Users, title: t('learnMore.howItWorks.step1.title'), description: t('learnMore.howItWorks.step1.description'), details: t('learnMore.howItWorks.step1.details'), delay: 0.2 }), _jsx(StepCard, { number: "2", icon: Calendar, title: t('learnMore.howItWorks.step2.title'), description: t('learnMore.howItWorks.step2.description'), details: t('learnMore.howItWorks.step2.details'), delay: 0.3 }), _jsx(StepCard, { number: "3", icon: ClipboardList, title: t('learnMore.howItWorks.step3.title'), description: t('learnMore.howItWorks.step3.description'), details: t('learnMore.howItWorks.step3.details'), delay: 0.4 }), _jsx(StepCard, { number: "4", icon: LayoutDashboard, title: t('learnMore.howItWorks.step4.title'), description: t('learnMore.howItWorks.step4.description'), details: t('learnMore.howItWorks.step4.details'), delay: 0.5 })] })] }) }), _jsx(motion.section, { className: "py-20", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 1 }, children: _jsxs("div", { className: "container mx-auto px-4", children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx(motion.h2, { className: "text-3xl font-bold mb-4", initial: { y: 20, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { delay: 0.2 }, children: t('learnMore.benefits.title') }), _jsx(motion.p, { className: "text-xl text-gray-600", initial: { y: 20, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { delay: 0.3 }, children: t('learnMore.benefits.subtitle') })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto", children: [_jsx(BenefitCard, { icon: Zap, title: t('learnMore.benefits.items.efficiency.title'), description: t('learnMore.benefits.items.efficiency.description'), delay: 0.2 }), _jsx(BenefitCard, { icon: FolderCheck, title: t('learnMore.benefits.items.organization.title'), description: t('learnMore.benefits.items.organization.description'), delay: 0.3 }), _jsx(BenefitCard, { icon: Settings, title: t('learnMore.benefits.items.flexibility.title'), description: t('learnMore.benefits.items.flexibility.description'), delay: 0.4 }), _jsx(BenefitCard, { icon: Globe, title: t('learnMore.benefits.items.accessibility.title'), description: t('learnMore.benefits.items.accessibility.description'), delay: 0.5 })] })] }) }), _jsx(motion.section, { className: "py-20 bg-blue-600", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 1 }, children: _jsxs("div", { className: "container mx-auto px-4 text-center", children: [_jsx(motion.h2, { className: "text-3xl font-bold text-white mb-6", initial: { y: 20, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { delay: 0.2 }, children: t('learnMore.cta.title') }), _jsx(motion.p, { className: "text-xl text-blue-100 mb-8 max-w-2xl mx-auto", initial: { y: 20, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { delay: 0.4 }, children: t('learnMore.cta.description') }), _jsx(motion.div, { initial: { y: 20, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { delay: 0.6 }, children: _jsx(Button, { onClick: () => navigate("/login"), className: "bg-white text-blue-600 hover:bg-blue-50", size: "lg", children: t('learnMore.cta.button') }) })] }) })] }));
}
