import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Plus, User } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import WorkerForm from '@/components/WorkerForm';
import WorkerDetails from '@/components/WorkerDetails';
import { format, differenceInDays } from 'date-fns';
import { cn } from "@/lib/utils";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export default function Workers() {
    const { isAuthenticated, checkAuthStatus } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isAddingWorker, setIsAddingWorker] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    useEffect(() => {
        const verifyAuth = async () => {
            const isValid = await checkAuthStatus();
            if (!isValid) {
                toast({
                    title: 'Authentication Required',
                    description: 'Please log in to access this page',
                    variant: 'destructive',
                });
                navigate('/login');
            }
        };
        verifyAuth();
    }, [checkAuthStatus, navigate, toast]);
    const { data: workers, error, isLoading, refetch } = useQuery({
        queryKey: ['workers'],
        queryFn: async () => {
            try {
                const response = await api.get('/api/workers');
                return response.data;
            }
            catch (error) {
                console.error('Error fetching workers:', error);
                throw error;
            }
        },
        enabled: isAuthenticated,
    });
    const filteredWorkers = workers?.filter(worker => {
        const fullName = `${worker.firstName} ${worker.lastName}`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase());
    });
    const handleAddWorker = async (workerData) => {
        try {
            const response = await api.post('/api/workers', workerData);
            if (response.data) {
                toast({
                    title: "Success",
                    description: "Worker added successfully",
                    variant: "success",
                });
                setIsAddingWorker(false);
                await refetch();
            }
            else {
                throw new Error('No response data received');
            }
        }
        catch (error) {
            console.error('Error adding worker:', error);
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to add worker",
                variant: "destructive",
            });
        }
    };
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center h-48", children: _jsx(Spinner, { size: "lg", className: "text-indigo-500" }) }));
    }
    if (error) {
        return _jsx("div", { children: "Error loading workers" });
    }
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50", children: _jsxs("div", { className: "container mx-auto p-6 space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center bg-white rounded-2xl p-6 shadow-lg border border-indigo-100", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent", children: "Workers Management" }), _jsx("p", { className: "text-gray-600 mt-2", children: "Manage your workforce and contracts efficiently" })] }), _jsxs(Dialog, { open: isAddingWorker, onOpenChange: setIsAddingWorker, children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs(Button, { className: "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg transition-all duration-200", children: [_jsx(Plus, { className: "mr-2 h-5 w-5" }), "Add Worker"] }) }), _jsxs(DialogContent, { className: "sm:max-w-[425px] bg-gradient-to-br from-white to-indigo-50/30 p-0 overflow-hidden border border-indigo-100", children: [_jsx("div", { className: "bg-gradient-to-r from-indigo-500 to-purple-500 p-6", children: _jsxs(DialogHeader, { className: "text-white", children: [_jsx(DialogTitle, { className: "text-2xl font-bold", children: "Add New Worker" }), _jsx(DialogDescription, { className: "text-indigo-100", children: "Fill in the worker's details below" })] }) }), _jsx("div", { className: "p-6", children: _jsx(WorkerForm, { onSubmit: handleAddWorker }) })] })] })] }), _jsxs("div", { className: "bg-white rounded-2xl shadow-lg border border-indigo-100 overflow-hidden", children: [_jsx("div", { className: "bg-gradient-to-r from-indigo-500 to-purple-500 p-6", children: _jsxs("div", { className: "max-w-md", children: [_jsx(Label, { className: "text-white mb-2 block", children: "Search Workers" }), _jsx(Input, { type: "text", placeholder: "Search by name...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white focus:text-gray-900" })] }) }), _jsx("div", { className: "p-6", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Worker ID" }), _jsx(TableHead, { children: "Name" }), _jsx(TableHead, { children: "Contract Status" }), _jsx(TableHead, { children: "Contract Duration" }), _jsx(TableHead, { children: "Start Date" }), _jsx(TableHead, { children: "End Date" }), _jsx(TableHead, { children: "Actions" })] }) }), _jsx(TableBody, { children: filteredWorkers?.map((worker) => {
                                            const latestContract = worker.contracts?.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())[0];
                                            let contractStatus = null;
                                            let statusColor = '';
                                            if (latestContract) {
                                                const today = new Date();
                                                const endDate = new Date(latestContract.endDate);
                                                const daysRemaining = differenceInDays(endDate, today);
                                                if (daysRemaining < 0) {
                                                    contractStatus = "Inactive";
                                                    statusColor = "bg-red-100 text-red-700";
                                                }
                                                else if (daysRemaining <= 30) {
                                                    contractStatus = `${daysRemaining} days remaining`;
                                                    statusColor = "bg-orange-100 text-orange-700";
                                                }
                                                else {
                                                    contractStatus = "Active";
                                                    statusColor = "bg-green-100 text-green-700";
                                                }
                                            }
                                            return (_jsxs(TableRow, { children: [_jsx(TableCell, { children: worker.workerId }), _jsx(TableCell, { children: `${worker.firstName} ${worker.lastName}` }), _jsx(TableCell, { children: latestContract ? (_jsx("span", { className: cn("inline-flex items-center rounded-full px-2 py-1 text-xs font-medium", statusColor), children: contractStatus })) : (_jsx("span", { className: "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700", children: "No Contract" })) }), _jsx(TableCell, { children: latestContract
                                                            ? `${latestContract.duration} months`
                                                            : '-' }), _jsx(TableCell, { children: latestContract
                                                            ? format(new Date(latestContract.startDate), 'PP')
                                                            : '-' }), _jsx(TableCell, { children: latestContract
                                                            ? format(new Date(latestContract.endDate), 'PP')
                                                            : '-' }), _jsx(TableCell, { children: _jsx(Button, { onClick: () => setSelectedWorker(worker), className: "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-sm hover:shadow-md transition-all duration-200", size: "sm", children: "View Details" }) })] }, worker.id));
                                        }) })] }) })] }), _jsx(Dialog, { open: !!selectedWorker, onOpenChange: () => setSelectedWorker(null), children: _jsxs(DialogContent, { className: "max-w-4xl bg-gradient-to-br from-white to-indigo-50/30 p-0 overflow-hidden border border-indigo-100", children: [_jsx("div", { className: "bg-gradient-to-r from-indigo-500 to-purple-500 p-6", children: _jsxs(DialogHeader, { className: "text-white", children: [_jsx(DialogTitle, { className: "text-2xl font-bold", children: "Worker Details" }), _jsx(DialogDescription, { className: "text-indigo-100", children: "View and manage worker information" })] }) }), selectedWorker && (_jsx("div", { className: "p-6", children: _jsxs("div", { className: "bg-white rounded-xl p-6 shadow-sm border border-indigo-100", children: [_jsxs("div", { className: "grid grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Personal Information" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center text-sm text-gray-600", children: [_jsx(User, { className: "mr-2 h-4 w-4" }), _jsxs("span", { className: "font-medium", children: [selectedWorker.firstName, " ", selectedWorker.lastName] })] }), _jsxs("div", { className: "flex items-center text-sm text-gray-600", children: [_jsx("span", { className: "font-medium mr-2", children: "Worker ID:" }), selectedWorker.workerId] }), selectedWorker.email && (_jsxs("div", { className: "flex items-center text-sm text-gray-600", children: [_jsx(Mail, { className: "mr-2 h-4 w-4" }), selectedWorker.email] })), selectedWorker.phone && (_jsxs("div", { className: "flex items-center text-sm text-gray-600", children: [_jsx(Phone, { className: "mr-2 h-4 w-4" }), selectedWorker.phone] })), selectedWorker.address && (_jsxs("div", { className: "flex items-center text-sm text-gray-600", children: [_jsx(MapPin, { className: "mr-2 h-4 w-4" }), selectedWorker.address] }))] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Contract Information" }), _jsx(WorkerDetails, { worker: selectedWorker, onUpdate: async () => {
                                                                await refetch();
                                                                setSelectedWorker(null);
                                                            } })] })] }), _jsxs("div", { className: "flex justify-end space-x-4 mt-6 pt-4 border-t", children: [_jsx(Button, { variant: "outline", onClick: () => setSelectedWorker(null), className: "border-indigo-200 text-indigo-600 hover:bg-indigo-50", children: "Close" }), _jsx(Button, { className: "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white", onClick: () => {
                                                        setSelectedWorker(null);
                                                    }, children: "Save Changes" })] })] }) }))] }) })] }) }));
}
