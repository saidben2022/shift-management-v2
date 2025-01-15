import { Shift } from '@/types/Shift';
interface DayWorkersDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedDate: Date;
    shifts: Shift[];
}
export declare function DayWorkersDialog({ open, onOpenChange, selectedDate, shifts, }: DayWorkersDialogProps): import("react/jsx-runtime").JSX.Element;
export {};
