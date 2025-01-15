import { Worker } from '@/types/Worker';
import { ShiftType } from '@/types/Shift';
interface WorkerPeriodHoursProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    worker: Worker;
    currentPeriod: {
        start: string;
        end: string;
    };
    onSave: (data: {
        workerId: number;
        maxHours: number;
        periodStart: string;
        periodEnd: string;
    }) => Promise<void>;
    shifts: Array<{
        hoursWorked: number;
        shiftType: ShiftType;
        startTime: string;
        endTime: string;
        worker?: {
            id: number;
        };
    }>;
    initialMaxHours?: number;
}
export declare function WorkerPeriodHours({ open, onOpenChange, worker, currentPeriod, onSave, shifts, initialMaxHours }: WorkerPeriodHoursProps): import("react/jsx-runtime").JSX.Element;
export {};
