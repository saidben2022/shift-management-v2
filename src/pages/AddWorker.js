import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToast } from "../components/ui/use-toast";
export default function AddWorker() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        workerId: '',
        contractStartDate: '',
        contractDuration: ''
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch(import.meta.env.VITE_API_URL + '/api/workers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    ...formData,
                    contractDuration: parseInt(formData.contractDuration)
                })
            });
            if (!response.ok) {
                throw new Error('Failed to add worker');
            }
            toast({
                title: "Success",
                description: "Worker has been added successfully",
                variant: "success",
            });
            navigate('/dashboard');
        }
        catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to add worker. Please try again.",
            });
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-50 p-4", children: _jsx("div", { className: "max-w-2xl mx-auto space-y-6", children: _jsxs(Card, { children: [_jsx(CardHeader, { className: "space-y-1", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx(CardTitle, { className: "text-2xl text-primary", children: "Add New Worker" }), _jsx(Button, { variant: "outline", className: "border-primary text-primary hover:bg-primary hover:text-white", onClick: () => navigate('/dashboard'), children: "Back to Dashboard" })] }) }), _jsx(CardContent, { children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "firstName", children: "First Name" }), _jsx(Input, { id: "firstName", name: "firstName", value: formData.firstName, onChange: handleChange, required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "lastName", children: "Last Name" }), _jsx(Input, { id: "lastName", name: "lastName", value: formData.lastName, onChange: handleChange, required: true })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "workerId", children: "Worker ID" }), _jsx(Input, { id: "workerId", name: "workerId", value: formData.workerId, onChange: handleChange, required: true })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "contractStartDate", children: "Contract Start Date" }), _jsx(Input, { id: "contractStartDate", name: "contractStartDate", type: "date", value: formData.contractStartDate, onChange: handleChange, required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "contractDuration", children: "Contract Duration (months)" }), _jsx(Input, { id: "contractDuration", name: "contractDuration", type: "number", min: "1", value: formData.contractDuration, onChange: handleChange, required: true })] })] }), _jsx(Button, { type: "submit", className: "w-full bg-primary text-white hover:bg-primary/90", disabled: isLoading, children: isLoading ? "Adding Worker..." : "Add Worker" })] }) })] }) }) }));
}
