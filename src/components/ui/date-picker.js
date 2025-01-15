import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger, } from "./popover";
export function DatePicker({ date, onSelect, disabled, placeholder = "Pick a date", }) {
    const [selectedDate, setSelectedDate] = React.useState(date);
    React.useEffect(() => {
        setSelectedDate(date);
    }, [date]);
    return (_jsxs(Popover, { children: [_jsx(PopoverTrigger, { asChild: true, children: _jsxs(Button, { variant: "outline", className: cn("w-[240px] justify-start text-left font-normal", !selectedDate && "text-muted-foreground"), disabled: disabled, children: [_jsx(CalendarIcon, { className: "mr-2 h-4 w-4" }), selectedDate ? format(selectedDate, "dd/MM/yyyy") : placeholder] }) }), _jsx(PopoverContent, { className: "w-auto p-0 bg-white rounded-md shadow-lg", align: "start", children: _jsx(Calendar, { mode: "single", selected: selectedDate, onSelect: (date) => {
                        setSelectedDate(date);
                        onSelect?.(date);
                    }, initialFocus: true, className: "rounded-md border" }) })] }));
}
