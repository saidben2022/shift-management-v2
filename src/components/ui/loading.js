import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
export function Loading({ className, size = "md", fullScreen = false }) {
    const sizeClasses = {
        sm: "w-5 h-5",
        md: "w-8 h-8",
        lg: "w-12 h-12"
    };
    const Spinner = () => (_jsxs("div", { className: cn("relative", sizeClasses[size], className), children: [_jsx("div", { className: "absolute w-full h-full rounded-full border-2 border-solid border-indigo-100" }), _jsx("div", { className: "absolute w-full h-full rounded-full border-2 border-solid border-indigo-500 border-t-transparent animate-spin" })] }));
    if (fullScreen) {
        return (_jsx("div", { className: "fixed inset-0 bg-gradient-to-br from-indigo-50 to-purple-50/30 backdrop-blur-sm flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white/80 p-8 rounded-xl shadow-lg border border-indigo-100 flex flex-col items-center space-y-4", children: [_jsx(Spinner, {}), _jsx("p", { className: "text-indigo-900 font-medium animate-pulse", children: "Loading..." })] }) }));
    }
    return _jsx(Spinner, {});
}
