import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { WorkerDialog } from './WorkerDialog';
import { WorkerPeriodHours } from './WorkerPeriodHours';
import { ShiftType } from '@/types/Shift';
import { WorkerStatusCards } from './WorkerStatusCards';
import { useTranslation } from 'react-i18next';
export function WorkerStatsTable({ workers, shifts, currentPeriodDates, onSetMaxHours, getWorkerPeriodMaxHours, showStatusCards = true }) {
    const { t } = useTranslation();
    const [workerDialogOpen, setWorkerDialogOpen] = useState(false);
    const [periodHoursDialogOpen, setPeriodHoursDialogOpen] = useState(false);
    const [selectedWorkerId, setSelectedWorkerId] = useState(null);
    const [periodHours, setPeriodHours] = useState({});
    useEffect(() => {
        const loadPeriodHours = async () => {
            const hours = {};
            for (const worker of workers) {
                try {
                    console.log('Fetching hours for worker:', worker.id);
                    const maxHours = await getWorkerPeriodMaxHours(worker.id, currentPeriodDates.start, currentPeriodDates.end);
                    console.log('Received maxHours:', maxHours);
                    hours[worker.id] = maxHours;
                }
                catch (error) {
                    console.error('Error fetching hours for worker:', worker.id, error);
                }
            }
            console.log('Setting period hours:', hours);
            setPeriodHours(hours);
        };
        loadPeriodHours();
    }, [workers, currentPeriodDates.start, currentPeriodDates.end, getWorkerPeriodMaxHours]);
    const getWorkerStats = (workerId) => {
        // Filter shifts for the current worker and period
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
        const sickLeave = workerShifts.filter(s => s.shiftType === ShiftType.SICK_LEAVE).length;
        const vacation = workerShifts.filter(s => s.shiftType === ShiftType.VACATION).length;
        const unpaidLeave = workerShifts.filter(s => s.shiftType === ShiftType.UNPAID_LEAVE).length;
        const normalHours = workerShifts
            .filter(s => s.shiftType === ShiftType.NORMAL_WORKDAY)
            .reduce((sum, s) => sum + s.hoursWorked, 0);
        const weekendHours = workerShifts
            .filter(s => s.shiftType === ShiftType.WEEKEND_DAY)
            .reduce((sum, s) => sum + s.hoursWorked, 0);
        const holidayHours = workerShifts
            .filter(s => s.shiftType === ShiftType.HOLIDAY)
            .reduce((sum, s) => sum + s.hoursWorked, 0);
        return {
            totalShifts: workerShifts.length,
            normalDays,
            weekendDays,
            holidays,
            sickLeave,
            vacation,
            unpaidLeave,
            normalHours,
            weekendHours,
            holidayHours,
            totalWorkHours: normalHours + weekendHours + holidayHours
        };
    };
    const handleSetHoursClick = (workerId) => {
        setSelectedWorkerId(workerId);
        setPeriodHoursDialogOpen(true);
    };
    const handleSaveHours = async (data) => {
        if (selectedWorkerId) {
            await onSetMaxHours({
                workerId: selectedWorkerId,
                maxHours: data.maxHours,
                periodStart: currentPeriodDates.start,
                periodEnd: currentPeriodDates.end
            });
            // Update local state
            setPeriodHours(prev => ({
                ...prev,
                [selectedWorkerId]: data.maxHours
            }));
        }
        setPeriodHoursDialogOpen(false);
    };
    return (_jsxs(_Fragment, { children: [showStatusCards && (_jsx(WorkerStatusCards, { workers: workers, shifts: shifts, periodHours: periodHours, currentPeriodDates: currentPeriodDates })), _jsx(WorkerDialog, { open: workerDialogOpen, onOpenChange: setWorkerDialogOpen }), periodHoursDialogOpen && selectedWorkerId && (_jsx(WorkerPeriodHours, { open: periodHoursDialogOpen, onOpenChange: setPeriodHoursDialogOpen, worker: workers.find(w => w.id === selectedWorkerId) || null, currentPeriod: currentPeriodDates, onSave: handleSaveHours, shifts: shifts, initialMaxHours: periodHours[selectedWorkerId] }))] }));
}
