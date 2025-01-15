import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "./ui/use-toast";
import { useWorkers } from '@/hooks/useWorkers';
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
export function WorkerDialog({ open, onOpenChange }) {
    const { toast } = useToast();
    const { addWorker } = useWorkers();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        workerId: '',
        contractStartDate: null,
        contractDuration: ''
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.firstName || !formData.lastName || !formData.workerId ||
            !formData.contractStartDate || !formData.contractDuration) {
            toast({
                title: "Error",
                description: "Please fill in all fields",
                variant: "destructive",
            });
            return;
        }
        try {
            await addWorker({
                ...formData,
                contractStartDate: format(formData.contractStartDate, 'yyyy-MM-dd'),
                contractDuration: parseInt(formData.contractDuration)
            });
            toast({
                title: "Success",
                description: "Worker added successfully",
                variant: "success",
            });
            // Reset form and close dialog
            setFormData({
                firstName: '',
                lastName: '',
                workerId: '',
                contractStartDate: null,
                contractDuration: ''
            });
            onOpenChange(false);
        }
        catch (error) {
            toast({
                title: "Error",
                description: "Failed to add worker",
                variant: "destructive",
            });
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Add New Worker" }) }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "firstName", children: "First Name" }), _jsx(Input, { id: "firstName", name: "firstName", value: formData.firstName, onChange: handleChange, placeholder: "John" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "lastName", children: "Last Name" }), _jsx(Input, { id: "lastName", name: "lastName", value: formData.lastName, onChange: handleChange, placeholder: "Doe" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "workerId", children: "Worker ID" }), _jsx(Input, { id: "workerId", name: "workerId", value: formData.workerId, onChange: handleChange, placeholder: "W001" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "contractStartDate", children: "Contract Start Date" }), _jsxs("div", { className: "relative", children: [_jsx(DatePicker, { selected: formData.contractStartDate, onChange: (date) => setFormData(prev => ({ ...prev, contractStartDate: date })), dateFormat: "yyyy-MM-dd", placeholderText: "Select date", className: cn("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50") }), _jsx(CalendarIcon, { className: "absolute right-3 top-2.5 h-5 w-5 text-gray-500" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "contractDuration", children: "Contract Duration (months)" }), _jsx(Input, { id: "contractDuration", name: "contractDuration", type: "number", min: "1", value: formData.contractDuration, onChange: handleChange, placeholder: "12" })] }), _jsxs("div", { className: "flex justify-end space-x-4", children: [_jsxs(Button, { type: "button", className: "bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-600 border border-gray-300 shadow-sm transition-all duration-200 hover:text-gray-900 flex items-center gap-2", onClick: () => onOpenChange(false), children: [_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }), _jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })] }), "Cancel"] }), _jsxs(Button, { type: "submit", className: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-sm transition-all duration-200 flex items-center gap-2", children: [_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("path", { d: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" }), _jsx("polyline", { points: "17 21 17 13 7 13 7 21" }), _jsx("polyline", { points: "7 3 7 8 15 8" })] }), "Save"] })] })] })] }) }));
}
