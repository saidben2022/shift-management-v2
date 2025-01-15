import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HoverCard, HoverCardContent, HoverCardTrigger, } from "@/components/ui/hover-card";
import { useTranslation } from 'react-i18next';
import { ShiftType } from '@/types/Shift';
import { format, differenceInDays } from 'date-fns';
import { User2 } from 'lucide-react';
import cn from 'classnames';
export function WorkerStatsHoverCard({ worker, shifts, periodStart, periodEnd, periodHours = 0, children }) {
    const { t } = useTranslation();
    const workerShifts = shifts.filter(shift => {
        const shiftStart = new Date(shift.startTime);
        const shiftEnd = new Date(shift.endTime);
        const periodStartDate = new Date(periodStart);
        const periodEndDate = new Date(periodEnd);
        return shift.worker?.id === worker.id &&
            shiftStart >= periodStartDate &&
            shiftEnd <= periodEndDate;
    });
    // Calculate total work hours (excluding leave types)
    const totalWorkHours = workerShifts
        .filter(s => [ShiftType.NORMAL_WORKDAY, ShiftType.WEEKEND_DAY, ShiftType.HOLIDAY].includes(s.shiftType))
        .reduce((sum, s) => sum + s.hoursWorked, 0);
    // Calculate total work days (excluding leave types)
    const totalWorkDays = workerShifts.filter(s => [ShiftType.NORMAL_WORKDAY, ShiftType.WEEKEND_DAY, ShiftType.HOLIDAY].includes(s.shiftType)).length;
    // Calculate leave days
    const sickLeaveDays = workerShifts.filter(s => s.shiftType === ShiftType.SICK_LEAVE).length;
    const vacationDays = workerShifts.filter(s => s.shiftType === ShiftType.VACATION).length;
    const unpaidLeaveDays = workerShifts.filter(s => s.shiftType === ShiftType.UNPAID_LEAVE).length;
    // Calculate completion rate based on period hours
    const completionRate = periodHours > 0
        ? ((totalWorkHours / periodHours) * 100).toFixed(1)
        : '0';
    // Calculate average hours per actual work day
    const averageHoursPerDay = totalWorkDays > 0
        ? (totalWorkHours / totalWorkDays).toFixed(1)
        : '0';
    // Get the latest contract
    const latestContract = worker.contracts?.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())[0];
    // Calculate remaining days if contract exists
    const remainingDays = latestContract ? differenceInDays(new Date(latestContract.endDate), new Date()) : null;
    // Determine contract status
    const getContractStatus = () => {
        if (!latestContract)
            return null;
        if (remainingDays === null)
            return null;
        if (remainingDays < 0) {
            return 'expired';
        }
        else if (remainingDays <= 30) {
            return 'ending';
        }
        else {
            return 'active';
        }
    };
    const contractStatus = getContractStatus();
    // Get status color
    const getStatusColor = () => {
        switch (contractStatus) {
            case 'expired':
                return 'text-red-600 bg-red-50';
            case 'ending':
                return 'text-orange-600 bg-orange-50';
            case 'active':
                return 'text-emerald-600 bg-emerald-50';
            default:
                return 'text-gray-600 bg-gray-50';
        }
    };
    // Get status text
    const getStatusText = () => {
        if (!remainingDays)
            return t('workers.contract.notSet');
        if (remainingDays < 0) {
            return t('workers.contract.expired', { days: Math.abs(remainingDays) });
        }
        else if (remainingDays === 0) {
            return t('workers.contract.endsToday');
        }
        else {
            return t('workers.contract.daysRemaining', { days: remainingDays });
        }
    };
    // Calculate contract hours per week (you might want to adjust this based on your business logic)
    const hoursPerWeek = latestContract ? (latestContract.duration / 7) * 40 : null; // Assuming 40 hours per week is full-time
    return (_jsxs(HoverCard, { children: [_jsx(HoverCardTrigger, { asChild: true, children: children }), _jsx(HoverCardContent, { className: "w-96 p-0 shadow-lg", children: _jsxs("div", { className: "relative", children: [_jsx("div", { className: "bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-t-lg", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "h-12 w-12 rounded-full bg-white/20 flex items-center justify-center", children: _jsx(User2, { className: "h-6 w-6 text-white" }) }), _jsxs("div", { className: "flex-1", children: [_jsxs("h4", { className: "text-lg font-semibold text-white", children: [worker.firstName, " ", worker.lastName] }), _jsx("p", { className: "text-sm text-blue-100", children: worker.workerId })] })] }) }), _jsxs("div", { className: "p-4 grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-lg", children: [_jsx("p", { className: "text-sm font-medium text-emerald-600", children: t('workers.statistics.completionRate') }), _jsxs("div", { className: "mt-1 flex items-end gap-1", children: [_jsxs("p", { className: "text-2xl font-bold text-emerald-700", children: [completionRate, "%"] }), _jsx("div", { className: "h-1.5 flex-1 bg-emerald-100 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-emerald-500 rounded-full transition-all duration-500", style: { width: `${Math.min(parseFloat(completionRate), 100)}%` } }) })] })] }), _jsxs("div", { className: "bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-lg", children: [_jsx("p", { className: "text-sm font-medium text-blue-600", children: t('workers.statistics.averageHours') }), _jsx("p", { className: "text-2xl font-bold text-blue-700", children: averageHoursPerDay })] })] }), _jsxs("div", { className: "px-4 pb-2", children: [_jsx("h5", { className: "text-sm font-medium text-gray-700 mb-2", children: t('workers.contract.title') }), _jsxs("div", { className: "bg-gray-50 p-3 rounded-lg space-y-3", children: [_jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500", children: t('workers.contract.startDate') }), _jsx("p", { className: "text-sm font-medium", children: latestContract ? format(new Date(latestContract.startDate), 'PP') : t('workers.contract.notSet') })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500", children: t('workers.contract.endDate') }), _jsx("p", { className: "text-sm font-medium", children: latestContract ? format(new Date(latestContract.endDate), 'PP') : t('workers.contract.notSet') })] })] }), latestContract && (_jsx("div", { className: cn("px-3 py-2 rounded-md text-sm font-medium", getStatusColor()), children: getStatusText() }))] })] }), _jsxs("div", { className: "p-4", children: [_jsx("h5", { className: "text-sm font-medium text-gray-700 mb-2", children: t('workers.statistics.periodSummary') }), _jsxs("div", { className: "grid grid-cols-3 gap-3", children: [_jsxs("div", { className: "bg-orange-50 p-2 rounded-lg", children: [_jsx("p", { className: "text-xs text-orange-600", children: t('workers.statistics.totalWorkDays') }), _jsx("p", { className: "text-lg font-semibold text-orange-700", children: totalWorkDays })] }), _jsxs("div", { className: "bg-purple-50 p-2 rounded-lg", children: [_jsx("p", { className: "text-xs text-purple-600", children: t('workers.statistics.totalHours') }), _jsx("p", { className: "text-lg font-semibold text-purple-700", children: totalWorkHours.toFixed(1) })] }), _jsxs("div", { className: "bg-blue-50 p-2 rounded-lg", children: [_jsx("p", { className: "text-xs text-blue-600", children: t('workers.statistics.periodHours') }), _jsx("p", { className: "text-lg font-semibold text-blue-700", children: periodHours })] })] })] }), _jsx("div", { className: "px-4 pb-4", children: _jsxs("div", { className: "bg-gray-50 p-3 rounded-lg grid grid-cols-3 gap-3", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-100", children: _jsx("p", { className: "text-sm font-medium text-red-700", children: sickLeaveDays }) }), _jsx("p", { className: "text-xs text-gray-600 mt-1", children: t('workers.statistics.sickLeaveDays') })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-100", children: _jsx("p", { className: "text-sm font-medium text-green-700", children: vacationDays }) }), _jsx("p", { className: "text-xs text-gray-600 mt-1", children: t('workers.statistics.vacationDays') })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100", children: _jsx("p", { className: "text-sm font-medium text-gray-700", children: unpaidLeaveDays }) }), _jsx("p", { className: "text-xs text-gray-600 mt-1", children: t('workers.statistics.unpaidLeaveDays') })] })] }) })] }) })] }));
}
