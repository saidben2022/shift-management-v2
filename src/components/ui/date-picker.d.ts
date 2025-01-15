interface DatePickerProps {
    date?: Date;
    onSelect?: (date: Date | undefined) => void;
    disabled?: boolean;
    placeholder?: string;
}
export declare function DatePicker({ date, onSelect, disabled, placeholder, }: DatePickerProps): import("react/jsx-runtime").JSX.Element;
export {};
