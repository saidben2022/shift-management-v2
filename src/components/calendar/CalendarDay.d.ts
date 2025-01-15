import { Shift } from "@/types/shift";
interface CalendarDayProps {
    day: string;
    name?: string;
    date: Date;
    shifts: Shift[];
    onDayClick: (date: Date) => void;
    onAddClick: (date: Date) => void;
    onShiftClick: (e: React.MouseEvent, shift: Shift) => void;
    onDeleteClick: (e: React.MouseEvent, shiftId: number) => void;
    isLoading?: boolean;
}
declare const CalendarDay: React.FC<CalendarDayProps>;
export default CalendarDay;
