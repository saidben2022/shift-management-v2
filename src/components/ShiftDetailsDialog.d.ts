import { Shift } from '@/types/Shift';
interface ShiftDetailsDialogProps {
    shift: Shift | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDelete: (shiftId: number) => Promise<void>;
}
export declare function ShiftDetailsDialog({ shift, open, onOpenChange, onDelete, }: ShiftDetailsDialogProps): import("react/jsx-runtime").JSX.Element | null;
export {};
