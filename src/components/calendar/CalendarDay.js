import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format, isToday } from "date-fns";
import { ShiftCard } from "./ShiftCard";
import { useTranslation } from 'react-i18next';
import { isWeekend, isHoliday, getHolidayName } from '@/utils/dateUtils';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
const CalendarDay = ({ day, date, shifts = [], onDayClick, onAddClick, onShiftClick, onDeleteClick, isLoading, }) => {
    const { t } = useTranslation();
    const isWeekendDay = isWeekend(date);
    const isHolidayDay = isHoliday(date);
    const holidayName = isHolidayDay ? getHolidayName(date) : null;
    const isTodayDate = isToday(date);
    const handleAddClick = (e) => {
        e.stopPropagation();
        onAddClick(date);
    };
    return (_jsx("div", { className: "min-h-[120px]", children: _jsxs(Card, { className: cn("h-full p-3 space-y-2 cursor-pointer transition-all duration-200 hover:shadow-md", "border border-gray-200", isWeekendDay && "bg-gradient-to-br from-purple-50 to-purple-100/50", isHolidayDay && "bg-gradient-to-br from-blue-50 to-blue-100/50", isTodayDate && "ring-2 ring-indigo-500 ring-offset-2"), onClick: () => onDayClick(date), children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("div", { className: cn("text-sm font-medium", isWeekendDay ? "text-purple-700" : isHolidayDay ? "text-blue-700" : "text-gray-700"), children: t(`days.${day}`) }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: cn("text-sm font-semibold", isWeekendDay ? "text-purple-600" : isHolidayDay ? "text-blue-600" : "text-gray-600"), children: format(date, "d") }), _jsx(Button, { size: "icon", variant: "ghost", className: cn("h-7 w-7 rounded-full", "bg-white/50 hover:bg-white", "border border-gray-200 shadow-sm", "transition-all duration-200", isWeekendDay && "hover:bg-purple-100 hover:text-purple-600 hover:border-purple-200", isHolidayDay && "hover:bg-blue-100 hover:text-blue-600 hover:border-blue-200", !isWeekendDay && !isHolidayDay && "hover:bg-indigo-100 hover:text-indigo-600 hover:border-indigo-200"), onClick: handleAddClick, title: "Add Shift", children: _jsx(Plus, { className: "h-4 w-4" }) })] })] }), holidayName && (_jsx("p", { className: "text-xs font-medium text-blue-600 bg-blue-100/50 py-0.5 px-2 rounded-full inline-block", children: holidayName })), _jsx("div", { className: "space-y-2", children: isLoading ? (_jsxs(_Fragment, { children: [_jsx(Skeleton, { className: "h-4 w-20" }), _jsx(Skeleton, { className: "h-4 w-24" }), _jsx(Skeleton, { className: "h-4 w-16" })] })) : (shifts.map((shift) => (_jsx(ShiftCard, { shift: shift, onClick: (e) => onShiftClick(e, shift), onDelete: onDeleteClick }, shift.id)))) })] }) }));
};
export default CalendarDay;
