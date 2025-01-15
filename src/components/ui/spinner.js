import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
export function Spinner({ size = "default", className, ...props }) {
    const sizeClasses = {
        sm: "h-4 w-4",
        default: "h-6 w-6",
        lg: "h-8 w-8"
    };
    return (_jsxs("div", { role: "status", className: cn("flex items-center justify-center", className), ...props, children: [_jsx(Loader2, { className: cn("animate-spin text-blue-500", sizeClasses[size]) }), _jsx("span", { className: "sr-only", children: "Loading" })] }));
}
