import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ShiftType } from "@/types/shift";
import { format } from "date-fns";
import { X, Clock, Calendar, MapPin } from "lucide-react";
import { useTranslation } from 'react-i18next';
const getShiftTypeColor = (type) => {
    if (!type)
        return {
            background: "bg-gradient-to-br from-gray-50 to-gray-100/50",
            text: "text-gray-700",
            hover: "hover:from-gray-100 hover:to-gray-200/50",
            border: "border-gray-200"
        };
    switch (type) {
        case ShiftType.NORMAL_WORKDAY:
            return {
                background: "bg-gradient-to-br from-green-50 to-green-100/50",
                text: "text-green-700",
                hover: "hover:from-green-100 hover:to-green-200/50",
                border: "border-green-200"
            };
        case ShiftType.WEEKEND_DAY:
            return {
                background: "bg-gradient-to-br from-blue-50 to-blue-100/50",
                text: "text-blue-700",
                hover: "hover:from-blue-100 hover:to-blue-200/50",
                border: "border-blue-200"
            };
        case ShiftType.HOLIDAY:
            return {
                background: "bg-gradient-to-br from-purple-50 to-purple-100/50",
                text: "text-purple-700",
                hover: "hover:from-purple-100 hover:to-purple-200/50",
                border: "border-purple-200"
            };
        case ShiftType.SICK_LEAVE:
            return {
                background: "bg-gradient-to-br from-red-50 to-red-100/50",
                text: "text-red-700",
                hover: "hover:from-red-100 hover:to-red-200/50",
                border: "border-red-200"
            };
        case ShiftType.VACATION:
            return {
                background: "bg-gradient-to-br from-orange-50 to-orange-100/50",
                text: "text-orange-700",
                hover: "hover:from-orange-100 hover:to-orange-200/50",
                border: "border-orange-200"
            };
        case ShiftType.UNPAID_LEAVE:
            return {
                background: "bg-gradient-to-br from-gray-50 to-gray-100/50",
                text: "text-gray-700",
                hover: "hover:from-gray-100 hover:to-gray-200/50",
                border: "border-gray-200"
            };
        default:
            return {
                background: "bg-gradient-to-br from-gray-50 to-gray-100/50",
                text: "text-gray-700",
                hover: "hover:from-gray-100 hover:to-gray-200/50",
                border: "border-gray-200"
            };
    }
};
const isLeaveType = (type) => {
    return [
        ShiftType.VACATION,
        ShiftType.SICK_LEAVE,
        ShiftType.UNPAID_LEAVE
    ].includes(type);
};
export function ShiftCard({ shift, onClick, onDelete }) {
    const { t } = useTranslation();
    if (!shift)
        return null;
    const isLeave = isLeaveType(shift.shiftType);
    const startDate = new Date(shift.startTime);
    const endDate = new Date(shift.endTime);
    const colors = getShiftTypeColor(shift.shiftType);
    return (_jsxs(Card, { className: cn("relative p-2.5 cursor-pointer transition-all duration-200", "border shadow-sm hover:shadow-md", colors.background, colors.hover, colors.border), onClick: (e) => onClick?.(e, shift), children: [_jsxs("div", { className: "text-xs space-y-1.5", children: [_jsx("div", { className: cn("font-medium", colors.text), children: shift.worker
                            ? `${shift.worker.firstName} ${shift.worker.lastName}`
                            : t('shifts.card.unknownWorker') }), _jsx("div", { className: cn("inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium", "bg-white/50 border", colors.text, colors.border), children: t(`dashboard.shifts.shiftTypes.${shift.shiftType}`) }), isLeave ? (_jsxs("div", { className: cn("flex items-center gap-1.5", colors.text), children: [_jsx(Calendar, { className: "h-3 w-3" }), _jsxs("span", { children: [format(startDate, 'MMM d'), " ", t('shifts.card.to'), " ", format(endDate, 'MMM d')] })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: cn("flex items-center gap-1.5", colors.text), children: [_jsx(Clock, { className: "h-3 w-3" }), _jsx("span", { children: t('shifts.card.hours', { hours: shift.hoursWorked }) })] }), shift.location && (_jsxs("div", { className: cn("flex items-center gap-1.5", colors.text), children: [_jsx(MapPin, { className: "h-3 w-3" }), _jsx("span", { children: shift.location })] }))] }))] }), onDelete && (_jsx("button", { onClick: (e) => {
                    e.stopPropagation();
                    onDelete(e, shift.id);
                }, className: cn("absolute top-1 right-1 p-1 rounded-full", "transition-all duration-200", "hover:bg-white/50", colors.text), "aria-label": t('common.delete'), children: _jsx(X, { className: "h-3 w-3" }) }))] }));
}
export default ShiftCard;
