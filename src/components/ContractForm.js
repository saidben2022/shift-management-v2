import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "./ui/form";
import { Input } from "./ui/input";
import { addMonths, subDays } from 'date-fns';
import { CalendarIcon } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const formSchema = z.object({
    startDate: z.date({
        required_error: "Contract start date is required",
    }),
    duration: z.coerce.number().min(1, "Contract duration must be at least 1 month"),
});
export default function ContractForm({ contract, onSubmit, isLoading }) {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            startDate: contract ? new Date(contract.startDate) : new Date(),
            duration: contract?.duration || 12,
        },
    });
    const calculateEndDate = (startDate, duration) => {
        if (!startDate || !duration || isNaN(duration))
            return undefined;
        try {
            if (isNaN(startDate.getTime()))
                return undefined;
            return subDays(addMonths(startDate, duration), 1);
        }
        catch (error) {
            return undefined;
        }
    };
    const handleSubmit = (data) => {
        onSubmit({
            ...data,
            duration: Number(data.duration),
            startDate: data.startDate,
        });
    };
    const startDate = form.watch('startDate');
    const duration = Number(form.watch('duration'));
    const endDate = calculateEndDate(startDate, duration);
    return (_jsx(Form, { ...form, children: _jsxs("form", { onSubmit: form.handleSubmit(handleSubmit), className: "space-y-4", children: [_jsx(FormField, { control: form.control, name: "startDate", render: ({ field }) => (_jsxs(FormItem, { className: "flex flex-col", children: [_jsx(FormLabel, { children: "Start Date" }), _jsx(FormControl, { children: _jsxs("div", { className: "relative", children: [_jsx(DatePicker, { selected: field.value, onChange: (date) => field.onChange(date), dateFormat: "PPP", className: "w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" }), _jsx(CalendarIcon, { className: "absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" })] }) }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "duration", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Duration (months)" }), _jsx(FormControl, { children: _jsx(Input, { type: "number", min: 1, className: "bg-white", ...field }) }), _jsx(FormMessage, {})] })) }), _jsxs("div", { className: "space-y-2", children: [_jsx(FormLabel, { children: "End Date" }), _jsxs("div", { className: "relative", children: [_jsx(DatePicker, { selected: endDate, dateFormat: "PPP", disabled: true, className: "w-full rounded-md border border-input bg-gray-50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" }), _jsx(CalendarIcon, { className: "absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" })] }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Automatically calculated based on start date and duration" })] }), _jsx(Button, { type: "submit", disabled: isLoading, className: "w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white", children: isLoading ? "Saving..." : "Save Contract" })] }) }));
}
