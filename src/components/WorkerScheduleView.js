import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { format, startOfDay, endOfDay } from 'date-fns';
import { nlBE } from 'date-fns/locale'; // Add Dutch locale import for date-fns
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { CalendarIcon, MapPinIcon, UserIcon, ClockIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ShiftType } from '@/types/Shift';
import { Badge } from "@/components/ui/badge";
export function WorkerScheduleView({ workers, shifts }) {
    const { t, i18n } = useTranslation();
    const today = new Date();
    const [startDate, setStartDate] = useState(startOfDay(today));
    const [endDate, setEndDate] = useState(endOfDay(today));
    const [selectedLocation, setSelectedLocation] = useState('all');
    const [groupByLocation, setGroupByLocation] = useState(false);
    // Get unique locations from shifts
    const locations = useMemo(() => {
        const uniqueLocations = new Set();
        shifts.forEach(shift => {
            if (shift.location) {
                uniqueLocations.add(shift.location);
            }
        });
        return Array.from(uniqueLocations);
    }, [shifts]);
    // Filter shifts based on date range and location
    const filteredShifts = useMemo(() => {
        return shifts.filter(shift => {
            if (!shift.startTime || !shift.endTime)
                return false;
            try {
                const shiftStart = new Date(shift.startTime);
                const shiftEnd = new Date(shift.endTime);
                if (isNaN(shiftStart.getTime()) || isNaN(shiftEnd.getTime()))
                    return false;
                const isInDateRange = shiftStart >= startDate && shiftEnd <= endDate;
                const isInLocation = selectedLocation === 'all' || shift.location === selectedLocation;
                return isInDateRange && isInLocation;
            }
            catch (error) {
                console.error('Error processing shift dates:', error);
                return false;
            }
        });
    }, [shifts, startDate, endDate, selectedLocation]);
    // Group shifts by worker or location
    const groupedShifts = useMemo(() => {
        if (groupByLocation) {
            const byLocation = {};
            filteredShifts.forEach(shift => {
                const location = shift.location || 'Unknown';
                if (!byLocation[location]) {
                    byLocation[location] = [];
                }
                byLocation[location].push(shift);
            });
            return byLocation;
        }
        else {
            const byWorker = {};
            filteredShifts.forEach(shift => {
                if (shift.worker) {
                    if (!byWorker[shift.worker.id]) {
                        byWorker[shift.worker.id] = [];
                    }
                    byWorker[shift.worker.id].push(shift);
                }
            });
            return byWorker;
        }
    }, [filteredShifts, groupByLocation]);
    const getShiftTypeBadge = (shiftType) => {
        const variants = {
            [ShiftType.NORMAL_WORKDAY]: {
                variant: "default",
                className: "bg-green-50 text-green-800 border-green-200 hover:bg-green-100"
            },
            [ShiftType.WEEKEND_DAY]: {
                variant: "secondary",
                className: "bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100"
            },
            [ShiftType.HOLIDAY]: {
                variant: "destructive",
                className: "bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100"
            },
            [ShiftType.SICK_LEAVE]: {
                variant: "warning",
                className: "bg-red-50 text-red-800 border-red-200 hover:bg-red-100"
            },
            [ShiftType.VACATION]: {
                variant: "success",
                className: "bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100"
            },
            [ShiftType.UNPAID_LEAVE]: {
                variant: "outline",
                className: "bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100"
            }
        };
        const style = variants[shiftType];
        return (_jsx(Badge, { variant: style.variant, className: style.className, children: t(`shifts.types.${shiftType.toLowerCase()}`) }));
    };
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                throw new Error('Invalid date');
            }
            return format(date, 'PP');
        }
        catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid date';
        }
    };
    const formatTime = (dateString) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                throw new Error('Invalid date');
            }
            return format(date, 'p');
        }
        catch (error) {
            console.error('Error formatting time:', error);
            return 'Invalid time';
        }
    };
    const isLoading = false;
    const locale = i18n.language === 'nl' ? nlBE : undefined; // Update locale to use nlBE
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-6 rounded-lg shadow-lg", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsxs("div", { className: "grid gap-3", children: [_jsx(Label, { className: "text-sm font-medium text-white", children: t('shifts.fields.startDate') }), _jsxs("div", { className: "relative", children: [_jsx(DatePicker, { selected: startDate, onChange: (date) => date && setStartDate(startOfDay(date)), className: cn("w-full rounded-lg border-0 bg-white/10 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder:text-white/70", "focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-0", "disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer", "hover:bg-white/20 transition-colors", "pl-10"), dateFormat: "yyyy-MM-dd", placeholderText: t('shifts.fields.selectStartDate'), locale: locale, popperClassName: "date-picker-popper", popperPlacement: "bottom", popperProps: {
                                                positionFixed: true,
                                                strategy: "fixed"
                                            }, portalId: "calendar-portal" }), _jsx(CalendarIcon, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" })] })] }), _jsxs("div", { className: "grid gap-3", children: [_jsx(Label, { className: "text-sm font-medium text-white", children: t('shifts.fields.endDate') }), _jsxs("div", { className: "relative", children: [_jsx(DatePicker, { selected: endDate, onChange: (date) => date && setEndDate(endOfDay(date)), minDate: startDate, className: cn("w-full rounded-lg border-0 bg-white/10 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder:text-white/70", "focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-0", "disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer", "hover:bg-white/20 transition-colors", "pl-10"), dateFormat: "yyyy-MM-dd", placeholderText: t('shifts.fields.selectEndDate'), locale: locale, popperClassName: "date-picker-popper", popperPlacement: "bottom", popperProps: {
                                                positionFixed: true,
                                                strategy: "fixed"
                                            }, portalId: "calendar-portal" }), _jsx(CalendarIcon, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { className: "text-sm font-medium text-white", children: t('shifts.fields.location') }), _jsxs(Select, { value: selectedLocation, onValueChange: setSelectedLocation, children: [_jsx(SelectTrigger, { className: "border-0 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors focus:ring-white/50", children: _jsx("div", { className: "flex items-center gap-2", children: _jsx(SelectValue, { placeholder: t('shifts.fields.selectLocation') }) }) }), _jsxs(SelectContent, { className: "bg-gradient-to-b from-blue-500 to-indigo-500 border-0 text-white", children: [_jsx(SelectItem, { value: "all", className: "focus:bg-white/20 focus:text-white", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(MapPinIcon, { className: "h-4 w-4 text-white/70" }), t('shifts.fields.selectLocation')] }) }), locations.map((location) => (_jsx(SelectItem, { value: location, className: "focus:bg-white/20 focus:text-white", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(MapPinIcon, { className: "h-4 w-4 text-white" }), location] }) }, location)))] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { className: "text-sm font-medium text-white", children: t('shifts.grouping.groupBy') }), _jsxs(Select, { value: groupByLocation ? 'location' : 'worker', onValueChange: (value) => setGroupByLocation(value === 'location'), children: [_jsx(SelectTrigger, { className: "border-0 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors focus:ring-white/50", children: _jsxs("div", { className: "flex items-center gap-2", children: [groupByLocation ? (_jsx(MapPinIcon, { className: "h-4 w-4 text-white" })) : (_jsx(UserIcon, { className: "h-4 w-4 text-white" })), _jsx(SelectValue, {})] }) }), _jsxs(SelectContent, { className: "bg-gradient-to-b from-blue-500 to-indigo-500 border-0 text-white", children: [_jsx(SelectItem, { value: "worker", className: "focus:bg-white/20 focus:text-white", children: _jsx("div", { className: "flex items-center gap-2", children: t('shifts.grouping.groupByWorker') }) }), _jsx(SelectItem, { value: "location", className: "focus:bg-white/20 focus:text-white", children: _jsx("div", { className: "flex items-center gap-2", children: t('shifts.grouping.groupByLocation') }) })] })] })] })] }) }), _jsx("div", { className: "grid gap-6", children: Object.entries(groupedShifts).map(([key, shifts]) => (_jsxs("div", { className: "rounded-lg border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow", children: [_jsx("div", { className: "border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [groupByLocation ? (_jsx("div", { className: "rounded-full bg-blue-100 p-2", children: _jsx(MapPinIcon, { className: "h-5 w-5 text-blue-600" }) })) : (_jsx("div", { className: "rounded-full bg-purple-100 p-2", children: _jsx(UserIcon, { className: "h-5 w-5 text-purple-600" }) })), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900", children: key }), _jsxs("p", { className: "text-sm text-gray-500", children: [shifts.length, " ", t('shifts.count')] })] })] }), _jsxs(Badge, { variant: "outline", className: "bg-blue-50 text-blue-700 border-blue-200", children: [shifts.reduce((acc, shift) => acc + (shift.hoursWorked || 0), 0), " ", t('shifts.hours')] })] }) }), _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { className: "bg-gradient-to-r from-blue-50 to-blue-100/50 hover:bg-blue-100/50", children: [_jsx(TableHead, { className: "font-semibold text-blue-900", children: t('shifts.fields.date') }), _jsx(TableHead, { className: "font-semibold text-blue-900", children: groupByLocation ? t('workers.fields.fullName') : t('shifts.fields.location') }), _jsx(TableHead, { className: "font-semibold text-blue-900", children: t('shifts.fields.type') }), _jsx(TableHead, { className: "font-semibold text-blue-900 text-right", children: t('shifts.fields.hours') })] }) }), _jsx(TableBody, { children: shifts.map((shift) => (_jsxs(TableRow, { className: cn("hover:bg-gray-50/80 transition-colors duration-150", shift.shiftType === ShiftType.VACATION && "bg-green-50/30 hover:bg-green-50/50", shift.shiftType === ShiftType.SICK_LEAVE && "bg-orange-50/30 hover:bg-orange-50/50", shift.shiftType === ShiftType.UNPAID_LEAVE && "bg-yellow-50/30 hover:bg-yellow-50/50", shift.shiftType === ShiftType.HOLIDAY && "bg-purple-50/30 hover:bg-purple-50/50", shift.shiftType === ShiftType.WEEKEND_DAY && "bg-blue-50/30 hover:bg-blue-50/50"), children: [_jsx(TableCell, { children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "h-8 w-8 rounded-full bg-gray-100/50 flex items-center justify-center", children: _jsx(CalendarIcon, { className: "h-4 w-4 text-gray-600" }) }), _jsx("span", { className: "font-medium text-gray-700", children: format(new Date(shift.startTime), 'EEEE, d MMMM yyyy', { locale }) })] }) }), _jsx(TableCell, { children: groupByLocation ? (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "h-8 w-8 rounded-full bg-purple-100/50 flex items-center justify-center", children: _jsx(UserIcon, { className: "h-4 w-4 text-purple-600" }) }), _jsx("span", { className: "text-gray-700", children: `${shift.worker?.firstName} ${shift.worker?.lastName}` })] })) : (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "h-8 w-8 rounded-full bg-blue-100/50 flex items-center justify-center", children: _jsx(MapPinIcon, { className: "h-4 w-4 text-blue-600" }) }), _jsx("span", { className: "text-gray-700", children: shift.location || '-' })] })) }), _jsx(TableCell, { children: getShiftTypeBadge(shift.shiftType) }), _jsx(TableCell, { className: "text-right font-medium", children: _jsxs("div", { className: "flex items-center justify-end gap-2", children: [_jsx("div", { className: "h-7 w-7 rounded-full bg-gray-100/50 flex items-center justify-center", children: _jsx(ClockIcon, { className: "h-4 w-4 text-gray-600" }) }), shift.hoursWorked ? (_jsx("span", { className: "text-gray-700", children: shift.hoursWorked.toFixed(1) })) : '-'] }) })] }, shift.id))) })] })] }, key))) })] }));
}
