import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo, useEffect } from 'react';
import { format, startOfWeek, addDays, getISOWeek } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from "../components/ui/button";
import { useToast } from '../components/ui/use-toast';
import { ShiftDialog } from "../components/ShiftDialog";
import { ShiftDetailsDialog } from "../components/ShiftDetailsDialog";
import { useWorkers } from '@/hooks/useWorkers';
import { useShifts } from '@/hooks/useShifts';
import { ShiftType } from '@/types/Shift';
import { getPeriods } from '@/lib/utils';
import CalendarDay from '@/components/calendar/CalendarDay';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { useQueryClient } from '@tanstack/react-query';
import { Label } from '@/components/ui/label';
import { DeleteConfirmationDialog } from '@/components/DeleteConfirmationDialog';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { useWorkerPeriodHours } from '@/hooks/useWorkerPeriodHours';
import { WorkerStatisticsTable } from '../components/WorkerStatisticsTable';
import { useTranslation } from 'react-i18next';
import { Spinner } from "@/components/ui/spinner";
export default function Shifts() {
    const { t } = useTranslation();
    const { toast } = useToast();
    const navigate = useNavigate();
    const { isAuthenticated, checkAuthStatus } = useAuth();
    const queryClient = useQueryClient();
    const { shifts, isLoading: isLoadingShifts, deleteShift, addShift } = useShifts();
    const [shiftDialogOpen, setShiftDialogOpen] = useState(false);
    const [shiftDetailsDialogOpen, setShiftDetailsDialogOpen] = useState(false);
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [shiftToDelete, setShiftToDelete] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedShift, setSelectedShift] = useState(null);
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const currentDate = new Date();
    const currentWeek = getISOWeek(currentDate);
    // Get current period index
    const allPeriods = useMemo(() => getPeriods(currentYear), [currentYear]);
    const initialPeriodIndex = useMemo(() => {
        return allPeriods.findIndex(period => period.weeks.includes(currentWeek));
    }, [allPeriods, currentWeek]);
    const [currentPeriodIndex, setCurrentPeriodIndex] = useState(Math.max(0, initialPeriodIndex));
    const [selectedWeek, setSelectedWeek] = useState(currentWeek);
    const { workers, isLoading: isLoadingWorkers } = useWorkers();
    const { data: periodHours, isLoading: isLoadingPeriodHours } = useWorkerPeriodHours();
    const isLoading = isLoadingWorkers || isLoadingShifts || isLoadingPeriodHours;
    const { setWorkerPeriodHours, getWorkerPeriodMaxHours } = useWorkerPeriodHours();
    const years = useMemo(() => {
        const startYear = 2010;
        const endYear = 2200;
        return Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
    }, []);
    const periods = useMemo(() => getPeriods(selectedYear), [selectedYear]);
    const currentPeriodDates = periods[currentPeriodIndex];
    const weekDays = useMemo(() => {
        if (!currentPeriodDates?.start || !selectedWeek) {
            return [];
        }
        // Find the start date of the selected week
        let currentDate = new Date(currentPeriodDates.start);
        while (getISOWeek(currentDate) !== selectedWeek) {
            currentDate = addDays(currentDate, 7);
        }
        // Get the start of the week (Monday)
        const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
        return Array.from({ length: 7 }, (_, i) => {
            const date = addDays(startDate, i);
            return {
                date,
                name: format(date, 'EEEE')
            };
        });
    }, [currentPeriodDates, selectedWeek]);
    useEffect(() => {
        const verifyAuth = async () => {
            const isValid = await checkAuthStatus();
            if (!isValid) {
                toast({
                    title: 'Authentication Required',
                    description: 'Please log in to access this page',
                    variant: 'destructive',
                });
                navigate('/login');
            }
        };
        verifyAuth();
    }, [checkAuthStatus, navigate, toast]);
    const handleYearChange = (year) => {
        const newYear = parseInt(year);
        setSelectedYear(newYear);
        setCurrentPeriodIndex(0);
        const newPeriods = getPeriods(newYear);
        if (newPeriods.length > 0) {
            setSelectedWeek(newPeriods[0].weeks[0]);
        }
    };
    const handlePeriodChange = (periodIndex) => {
        const index = parseInt(periodIndex);
        setCurrentPeriodIndex(index);
        if (periods[index]) {
            setSelectedWeek(periods[index].weeks[0]);
        }
    };
    const handleDayClick = (date) => {
        // Create a new date to avoid mutating the original
        const newDate = new Date(date);
        setSelectedDate(newDate);
        setShiftDetailsDialogOpen(true);
    };
    const handleAddClick = (date) => {
        // Create a new date to avoid mutating the original
        const newDate = new Date(date);
        setSelectedDate(newDate);
        setShiftDialogOpen(true);
    };
    const handleShiftClick = (e, shift) => {
        e.stopPropagation();
        setSelectedShift(shift);
        setShiftDetailsDialogOpen(true);
    };
    const handleShiftSave = async (shiftData) => {
        try {
            console.log('Saving shift with data:', shiftData);
            await addShift(shiftData);
            toast({
                title: "Success",
                description: "Successfully added shift!",
                variant: "success",
            });
        }
        catch (error) {
            console.error('Error saving shift:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "An error occurred while adding the shift. Please try again.",
            });
            throw error;
        }
    };
    const handleShiftDelete = async () => {
        if (!shiftToDelete)
            return;
        try {
            await deleteShift(shiftToDelete);
            setDeleteConfirmationOpen(false);
            setShiftToDelete(null);
            setShiftDetailsDialogOpen(false);
            toast({
                title: "Success",
                description: "Successfully deleted shift!",
                variant: "success",
            });
        }
        catch (error) {
            console.error('Error deleting shift:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "An error occurred while deleting the shift. Please try again.",
            });
        }
    };
    const YearSelect = () => (_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium text-gray-700", children: t('shifts.year') }), _jsxs(Select, { value: selectedYear.toString(), onValueChange: (value) => {
                    setSelectedYear(parseInt(value));
                    setCurrentPeriodIndex(0);
                }, children: [_jsx(SelectTrigger, { className: "w-[120px]", children: _jsx(SelectValue, {}) }), _jsx(SelectContent, { className: "max-h-[300px] overflow-y-scroll scrollbar scrollbar-thumb-gray-400 scrollbar-track-gray-100", children: years.map((year) => (_jsx(SelectItem, { value: year.toString(), className: cn("cursor-pointer transition-colors", year === currentYear && "font-medium"), children: year }, year))) })] })] }));
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50", children: isLoading ? (_jsx("div", { className: "flex items-center justify-center h-48", children: _jsx(Spinner, { size: "lg", className: "text-indigo-500" }) })) : (_jsxs("div", { className: "container mx-auto p-6 space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center bg-white rounded-2xl p-6 shadow-lg border border-indigo-100", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent", children: t('app.shift-title') }), _jsx("p", { className: "text-gray-600 mt-2", children: t('app.shift-description') })] }), _jsx("div", { children: _jsxs(Button, { onClick: () => setShiftDialogOpen(true), className: "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600", children: [_jsx(Plus, { className: "mr-2 h-4 w-4" }), "Add Shift"] }) })] }), _jsxs("div", { className: "grid gap-4", children: [_jsxs("div", { className: "bg-white rounded-2xl shadow-lg border border-indigo-100 overflow-hidden", children: [_jsx("div", { className: "bg-gradient-to-r from-indigo-500 to-purple-500 p-6", children: _jsxs("div", { className: "flex flex-col md:flex-row gap-4 items-start md:items-end", children: [_jsxs("div", { children: [_jsx(Label, { className: "text-white mb-2 block", children: t('shifts.year') }), _jsxs(Select, { value: selectedYear.toString(), onValueChange: (value) => {
                                                            setSelectedYear(parseInt(value));
                                                            setCurrentPeriodIndex(0);
                                                        }, children: [_jsx(SelectTrigger, { className: "w-[120px] bg-white/10 border-white/20 text-white", children: _jsx(SelectValue, {}) }), _jsx(SelectContent, { className: "max-h-[300px] overflow-y-scroll bg-white", children: years.map((year) => (_jsx(SelectItem, { value: year.toString(), className: cn("cursor-pointer transition-colors hover:bg-indigo-50", year === currentYear && "bg-indigo-50 font-medium"), children: year }, year))) })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { className: "text-white mb-2 block", children: t('shifts.period') }), _jsxs(Select, { value: currentPeriodIndex.toString(), onValueChange: (value) => {
                                                            const index = parseInt(value);
                                                            setCurrentPeriodIndex(index);
                                                            const periodWeeks = periods[index].weeks;
                                                            setSelectedWeek(periodWeeks[0]);
                                                        }, children: [_jsx(SelectTrigger, { className: "w-[300px] bg-white/10 border-white/20 text-white", children: _jsx(SelectValue, { children: currentPeriodDates ? (_jsxs("span", { children: [format(new Date(currentPeriodDates.start), 'dd/MM/yyyy'), " - ", format(new Date(currentPeriodDates.end), 'dd/MM/yyyy')] })) : (t('shifts.selectPeriod')) }) }), _jsx(SelectContent, { className: "bg-white", children: periods.map((period, index) => (_jsxs(SelectItem, { value: index.toString(), className: cn("cursor-pointer transition-colors hover:bg-indigo-50", index === initialPeriodIndex && "bg-indigo-50 font-medium"), children: [format(new Date(period.start), 'dd/MM/yyyy'), " - ", format(new Date(period.end), 'dd/MM/yyyy')] }, index))) })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { className: "text-white mb-2 block", children: t('shifts.periods.week') }), _jsxs(Select, { value: selectedWeek.toString(), onValueChange: (value) => setSelectedWeek(parseInt(value)), children: [_jsx(SelectTrigger, { className: "w-[180px] bg-white/10 border-white/20 text-white", children: _jsx(SelectValue, { placeholder: t('shifts.periods.selectWeek') }) }), _jsx(SelectContent, { className: "bg-white", children: currentPeriodDates?.weeks.map((week) => (_jsxs(SelectItem, { value: week.toString(), className: cn("cursor-pointer transition-colors hover:bg-indigo-50", week === currentWeek && "bg-indigo-50 font-medium"), children: [t('shifts.periods.week'), " ", week] }, week))) })] })] })] }) }), _jsx("div", { className: "p-6", children: _jsx("div", { className: "grid grid-cols-7 gap-4", children: weekDays.map(({ date, name }) => (_jsx(CalendarDay, { date: date, day: format(date, 'EEEE').toLowerCase(), name: name, shifts: shifts?.filter(shift => {
                                                const shiftStart = new Date(shift.startTime);
                                                const shiftEnd = new Date(shift.endTime);
                                                const currentDate = new Date(date);
                                                currentDate.setHours(0, 0, 0, 0);
                                                const startDate = new Date(shiftStart);
                                                startDate.setHours(0, 0, 0, 0);
                                                const endDate = new Date(shiftEnd);
                                                endDate.setHours(0, 0, 0, 0);
                                                if ([ShiftType.VACATION, ShiftType.SICK_LEAVE, ShiftType.UNPAID_LEAVE].includes(shift.shiftType)) {
                                                    return currentDate >= startDate && currentDate <= endDate;
                                                }
                                                return currentDate.getTime() === startDate.getTime();
                                            }) || [], onDayClick: handleDayClick, onAddClick: handleAddClick, onShiftClick: handleShiftClick, onDeleteClick: (e, shiftId) => {
                                                e.stopPropagation();
                                                setShiftToDelete(shiftId);
                                                setDeleteConfirmationOpen(true);
                                            } }, date.toISOString()))) }) })] }), _jsxs("div", { className: "bg-white rounded-2xl shadow-lg border border-indigo-100 overflow-hidden", children: [_jsx("div", { className: "bg-gradient-to-r from-indigo-500 to-purple-500 p-6", children: _jsx("h2", { className: "text-2xl font-bold text-white", children: "Worker Statistics" }) }), _jsx("div", { className: "p-6", children: _jsx(WorkerStatisticsTable, { workers: workers || [], shifts: shifts || [], currentPeriodDates: {
                                            start: currentPeriodDates?.start || '',
                                            end: currentPeriodDates?.end || ''
                                        }, onSetMaxHours: setWorkerPeriodHours, getWorkerPeriodMaxHours: getWorkerPeriodMaxHours, isLoading: isLoading, onSaveShift: handleShiftSave }) })] }), selectedDate && (_jsx(ShiftDialog, { open: shiftDialogOpen, onOpenChange: setShiftDialogOpen, selectedDate: selectedDate, onSave: handleShiftSave, workers: workers || [], shifts: shifts || [], currentPeriod: {
                                start: currentPeriodDates?.start || '',
                                end: currentPeriodDates?.end || ''
                            }, getWorkerPeriodMaxHours: getWorkerPeriodMaxHours })), selectedShift && (_jsx(ShiftDetailsDialog, { open: shiftDetailsDialogOpen, onOpenChange: setShiftDetailsDialogOpen, shift: selectedShift, onDelete: () => {
                                setShiftToDelete(selectedShift.id);
                                setDeleteConfirmationOpen(true);
                            }, isLoading: isLoading })), _jsx(DeleteConfirmationDialog, { open: deleteConfirmationOpen, onOpenChange: setDeleteConfirmationOpen, onConfirm: handleShiftDelete, title: "Delete Shift", description: "Are you sure you want to delete this shift? This action cannot be undone." })] })] })) }));
}
