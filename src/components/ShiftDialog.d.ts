import "react-datepicker/dist/react-datepicker.css";
interface ShiftDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: any) => Promise<void>;
    shifts: any[];
    workers: any[];
    selectedDate: Date | undefined;
    currentPeriod: {
        start: string;
        end: string;
    };
    getWorkerPeriodMaxHours: (workerId: number, periodStart: string, periodEnd: string) => Promise<number | undefined>;
}
export declare function ShiftDialog({ open, onOpenChange, onSave, shifts, workers, selectedDate, currentPeriod, getWorkerPeriodMaxHours }: ShiftDialogProps): import("react/jsx-runtime").JSX.Element;
export {};
