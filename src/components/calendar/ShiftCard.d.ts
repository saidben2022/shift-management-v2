import { Shift } from "@/types/shift";
interface ShiftCardProps {
    shift: Shift;
    onClick?: (e: React.MouseEvent, shift: Shift) => void;
    onDelete?: (e: React.MouseEvent, shiftId: number) => void;
}
export declare function ShiftCard({ shift, onClick, onDelete }: ShiftCardProps): import("react/jsx-runtime").JSX.Element | null;
export default ShiftCard;
