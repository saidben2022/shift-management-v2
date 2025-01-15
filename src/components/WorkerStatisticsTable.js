import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WorkerPeriodHours } from './WorkerPeriodHours';
import { ShiftType } from '@/types/Shift';
import { cn } from '@/lib/utils';
import { AlertTriangle, Clock, User2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { WorkerDetailsPopover } from './WorkerDetailsPopover';
import { TableSkeleton } from "@/components/TableSkeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { format } from 'date-fns';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ShiftDialog } from './ShiftDialog';
export function WorkerStatisticsTable({ workers, shifts, currentPeriodDates, onSetMaxHours, getWorkerPeriodMaxHours, isLoading, onSaveShift, }) {
    const { t } = useTranslation();
    const [periodHoursDialogOpen, setPeriodHoursDialogOpen] = useState(false);
    const [selectedWorkerId, setSelectedWorkerId] = useState(null);
    const [shiftDialogOpen, setShiftDialogOpen] = useState(false);
    const [periodHours, setPeriodHours] = useState({});
    // Load period hours for all workers
    useEffect(() => {
        const loadPeriodHours = async () => {
            if (!workers || workers.length === 0 || !currentPeriodDates.start || !currentPeriodDates.end)
                return;
            const hours = {};
            for (const worker of workers) {
                try {
                    const maxHours = await getWorkerPeriodMaxHours(worker.id, currentPeriodDates.start, currentPeriodDates.end);
                    if (maxHours !== undefined) {
                        hours[worker.id] = maxHours;
                    }
                }
                catch (error) {
                    console.error(`Error loading period hours for worker ${worker.id}:`, error);
                }
            }
            setPeriodHours(hours);
        };
        loadPeriodHours();
    }, [workers, currentPeriodDates, getWorkerPeriodMaxHours]);
    // Handle setting max hours
    const handleSetMaxHours = async (data) => {
        if (selectedWorkerId) {
            await onSetMaxHours({
                workerId: selectedWorkerId,
                maxHours: data.maxHours,
                periodStart: currentPeriodDates.start,
                periodEnd: currentPeriodDates.end
            });
            // Update local state after successful save
            setPeriodHours(prev => ({
                ...prev,
                [selectedWorkerId]: data.maxHours
            }));
        }
        setPeriodHoursDialogOpen(false);
    };
    const getWorkerStats = (workerId) => {
        const workerShifts = shifts.filter(shift => {
            const shiftStart = new Date(shift.startTime);
            const shiftEnd = new Date(shift.endTime);
            const periodStart = new Date(currentPeriodDates.start);
            const periodEnd = new Date(currentPeriodDates.end);
            return shift.worker?.id === workerId &&
                shiftStart >= periodStart &&
                shiftEnd <= periodEnd;
        });
        const normalDays = workerShifts.filter(s => s.shiftType === ShiftType.NORMAL_WORKDAY).length;
        const weekendDays = workerShifts.filter(s => s.shiftType === ShiftType.WEEKEND_DAY).length;
        const holidays = workerShifts.filter(s => s.shiftType === ShiftType.HOLIDAY).length;
        const sickLeaveDays = workerShifts.filter(s => s.shiftType === ShiftType.SICK_LEAVE).length;
        const vacationDays = workerShifts.filter(s => s.shiftType === ShiftType.VACATION).length;
        const unpaidLeaveDays = workerShifts.filter(s => s.shiftType === ShiftType.UNPAID_LEAVE).length;
        const normalHours = workerShifts
            .filter(s => s.shiftType === ShiftType.NORMAL_WORKDAY)
            .reduce((sum, s) => sum + s.hoursWorked, 0);
        const weekendHours = workerShifts
            .filter(s => s.shiftType === ShiftType.WEEKEND_DAY)
            .reduce((sum, s) => sum + s.hoursWorked, 0);
        const holidayHours = workerShifts
            .filter(s => s.shiftType === ShiftType.HOLIDAY)
            .reduce((sum, s) => sum + s.hoursWorked, 0);
        const totalWorkDays = normalDays + weekendDays + holidays;
        const totalWorkHours = normalHours + weekendHours + holidayHours;
        const maxHours = periodHours[workerId] || 0;
        // Calculate adjusted max hours based on leave days
        const totalLeaveDays = sickLeaveDays + vacationDays + unpaidLeaveDays;
        const workDaysInPeriod = maxHours / 8; // Assuming 8 hours per work day
        const adjustedMaxHours = maxHours * ((workDaysInPeriod - totalLeaveDays) / workDaysInPeriod);
        const completionRate = adjustedMaxHours > 0
            ? ((totalWorkHours / adjustedMaxHours) * 100).toFixed(1)
            : '0';
        return {
            totalShifts: workerShifts.length,
            normalDays,
            weekendDays,
            holidays,
            sickLeaveDays,
            vacationDays,
            unpaidLeaveDays,
            normalHours,
            weekendHours,
            holidayHours,
            totalWorkHours,
            completionRate
        };
    };
    const getShiftsByType = (workerId, type = ShiftType.NORMAL_WORKDAY) => {
        return shifts
            .filter(s => {
            const shiftStart = new Date(s.startTime);
            const shiftEnd = new Date(s.endTime);
            const periodStart = new Date(currentPeriodDates.start);
            const periodEnd = new Date(currentPeriodDates.end);
            return s.worker?.id === workerId &&
                s.shiftType === type &&
                shiftStart >= periodStart &&
                shiftEnd <= periodEnd;
        })
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    };
    const ShiftList = ({ shifts }) => (_jsxs("div", { className: "space-y-2", children: [shifts.map(shift => (_jsxs("div", { className: "flex justify-between items-center text-sm py-1.5 px-2 rounded-md hover:bg-gray-50 transition-colors cursor-default", children: [_jsx("span", { className: "text-gray-700 font-medium", children: format(new Date(shift.startTime), 'EEE, dd MMM yyyy') }), _jsxs(Badge, { variant: "secondary", className: "font-mono bg-blue-50 text-blue-700 hover:bg-blue-100", children: [shift.hoursWorked.toFixed(1), "h"] })] }, shift.id))), shifts.length === 0 && (_jsx("div", { className: "text-sm text-gray-500 italic text-center py-2", children: "No shifts found" }))] }));
    const handleSetHoursClick = (workerId) => {
        setSelectedWorkerId(workerId);
        setPeriodHoursDialogOpen(true);
    };
    return (_jsxs(Card, { children: [_jsx(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: _jsxs(CardTitle, { className: "text-xl font-bold", children: [format(new Date(currentPeriodDates.start), 'MMMM d'), " - ", format(new Date(currentPeriodDates.end), 'MMMM d, yyyy')] }) }), _jsxs(CardContent, { children: [isLoading ? (_jsx(TableSkeleton, { columns: 7, rows: 5 })) : (_jsxs("div", { children: [(() => {
                                const workersOverLimit = workers
                                    .map(worker => {
                                    const stats = getWorkerStats(worker.id);
                                    const maxHours = periodHours[worker.id] || 0;
                                    const remainingHours = maxHours - stats.totalWorkHours;
                                    return {
                                        worker,
                                        remainingHours,
                                        totalHours: stats.totalWorkHours,
                                        maxHours
                                    };
                                })
                                    .filter(({ remainingHours }) => remainingHours < 0);
                                if (workersOverLimit.length > 0) {
                                    return (_jsx("div", { className: "mx-4 mt-4", children: _jsx("div", { className: "bg-red-50 border border-red-200 rounded-md p-3", children: _jsxs("div", { className: "flex gap-2", children: [_jsx(AlertTriangle, { className: "h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsxs("h3", { className: "text-sm font-medium text-red-800", children: [workersOverLimit.length, " ", workersOverLimit.length === 1 ? 'worker has' : 'workers have', " exceeded their period hours"] }), _jsx("div", { className: "mt-1 text-sm text-red-700", children: _jsx("ul", { className: "list-disc pl-5 space-y-1", children: workersOverLimit.map(({ worker, remainingHours, totalHours, maxHours }) => (_jsxs("li", { children: [worker.firstName, " ", worker.lastName, ": ", totalHours.toFixed(1), "h / ", maxHours, "h"] }, worker.id))) }) })] })] }) }) }));
                                }
                                return null;
                            })(), _jsx("div", { className: "overflow-x-auto", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { className: "bg-gray-50/60", children: [_jsx(TableHead, { children: t('workers.fields.name') }), _jsx(TableHead, { className: "text-right", children: t('statistics.period') }), _jsx(TableHead, { className: "text-right", children: t('statistics.total') }), _jsx(TableHead, { className: "text-right", children: t('statistics.remaining') }), _jsx(TableHead, { className: "text-right", children: t('statistics.progress') }), _jsx(TableHead, { className: "text-right", children: _jsxs("div", { className: "flex items-center justify-end gap-1", children: [_jsx(Clock, { className: "h-3.5 w-3.5" }), _jsx("span", { children: t('statistics.days') })] }) }), _jsx(TableHead, { className: "text-center", children: t('statistics.actions') })] }) }), _jsx(TableBody, { children: workers.map(worker => {
                                                const stats = getWorkerStats(worker.id);
                                                const maxHours = periodHours[worker.id] || 0;
                                                const remainingHours = maxHours - stats.totalWorkHours;
                                                const completionRate = stats.completionRate;
                                                return (_jsxs(TableRow, { className: "hover:bg-gray-50/60 transition-colors", children: [_jsx(TableCell, { children: _jsx(WorkerDetailsPopover, { worker: worker, shifts: shifts, periodStart: currentPeriodDates.start, periodEnd: currentPeriodDates.end, periodHours: periodHours[worker.id] || 0, children: _jsxs("button", { className: "group flex items-center gap-2 hover:bg-blue-50 px-2 py-1 rounded-md transition-all", children: [_jsx(User2, { className: "h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" }), _jsxs("span", { className: "text-left font-medium text-gray-600 group-hover:text-blue-600 transition-colors", children: [worker.firstName, " ", worker.lastName] })] }) }) }), _jsx(TableCell, { className: "text-right", children: _jsx(Badge, { variant: maxHours === 0 ? "destructive" : "secondary", className: cn("font-mono", maxHours > 0 ? "bg-blue-50 text-blue-700 hover:bg-blue-100" : ""), children: maxHours > 0 ? maxHours : '-' }) }), _jsx(TableCell, { className: "text-right font-mono", children: stats.totalWorkHours.toFixed(1) }), _jsx(TableCell, { className: "text-right", children: _jsx(Badge, { variant: remainingHours < 0 ? "destructive" : remainingHours > 10 ? "default" : "warning", className: cn("font-mono", remainingHours >= 0 ? "bg-green-50 text-green-700 hover:bg-green-100" : "bg-red-50 text-red-700 hover:bg-red-100"), children: remainingHours !== null ? remainingHours.toFixed(1) : '-' }) }), _jsx(TableCell, { className: "text-right", children: _jsxs("div", { className: "flex items-center justify-end gap-2", children: [_jsx(Progress, { value: parseFloat(completionRate), className: "w-16 h-2", indicatorClassName: cn(parseFloat(completionRate) >= 100 ? "bg-green-500" :
                                                                            parseFloat(completionRate) >= 75 ? "bg-blue-500" :
                                                                                parseFloat(completionRate) >= 50 ? "bg-yellow-500" :
                                                                                    "bg-red-500") }), _jsxs("span", { className: "text-sm font-mono w-12", children: [completionRate, "%"] })] }) }), _jsx(TableCell, { className: "text-right", children: _jsx("div", { className: "flex items-center justify-end gap-4", children: _jsxs(HoverCard, { children: [_jsx(HoverCardTrigger, { asChild: true, children: _jsxs("div", { className: "inline-flex items-center gap-1 cursor-help hover:text-blue-600 transition-colors", children: [_jsx("span", { className: "font-mono", children: stats.normalDays + stats.weekendDays + stats.holidays }), _jsx("span", { className: "text-xs text-gray-500", children: t('statistics.total') })] }) }), _jsx(HoverCardContent, { className: "w-52", align: "end", children: _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-gray-600", children: t('statistics.normal') }), _jsx("span", { className: "font-mono text-sm", children: stats.normalDays })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-gray-600", children: t('statistics.weekend') }), _jsx("span", { className: "font-mono text-sm", children: stats.weekendDays })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-gray-600", children: t('statistics.holiday') }), _jsx("span", { className: "font-mono text-sm", children: stats.holidays })] })] }) })] }) }) }), _jsx(TableCell, { className: "text-center", children: _jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleSetHoursClick(worker.id), className: "text-blue-600 hover:text-blue-700 hover:bg-blue-50", children: t('statistics.setHours') }) })] }, worker.id));
                                            }) })] }) })] })), periodHoursDialogOpen && selectedWorkerId && (_jsx(WorkerPeriodHours, { open: periodHoursDialogOpen, onOpenChange: setPeriodHoursDialogOpen, worker: workers.find(w => w.id === selectedWorkerId), currentPeriod: currentPeriodDates, onSave: handleSetMaxHours, shifts: shifts, initialMaxHours: periodHours[selectedWorkerId] || 0 })), shiftDialogOpen && (_jsx(ShiftDialog, { open: shiftDialogOpen, onOpenChange: setShiftDialogOpen, onSave: onSaveShift, shifts: shifts, workers: workers, selectedDate: new Date(), currentPeriod: currentPeriodDates, getWorkerPeriodMaxHours: getWorkerPeriodMaxHours }))] })] }));
}
