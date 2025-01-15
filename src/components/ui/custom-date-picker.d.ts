import "react-datepicker/dist/react-datepicker.css";
interface CustomDatePickerProps {
    selected: Date | null;
    onChange: (date: Date | null) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}
export declare function CustomDatePicker({ selected, onChange, placeholder, className, disabled }: CustomDatePickerProps): import("react/jsx-runtime").JSX.Element;
export {};
