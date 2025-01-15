import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button } from './ui/button';
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "./ui/dialog";
import { Card, CardContent } from './ui/card';
import WorkerForm from './WorkerForm';
import ContractForm from './ContractForm';
import { format } from 'date-fns';
import { api } from '@/lib/api';
import { useToast } from './ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "./ui/alert-dialog";
import { useTranslation } from 'react-i18next';
export default function WorkerDetails({ worker, onUpdate }) {
    const [isEditingWorker, setIsEditingWorker] = useState(false);
    const [isAddingContract, setIsAddingContract] = useState(false);
    const [isEditingContract, setIsEditingContract] = useState(false);
    const [selectedContract, setSelectedContract] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [contractToDelete, setContractToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const { t } = useTranslation();
    const handleDeleteContract = async (contract) => {
        try {
            setIsLoading(true);
            await api.delete(`/api/workers/${worker.id}/contract/${contract.id}`);
            toast({
                title: "Success",
                description: "Contract deleted successfully",
                variant: "success",
            });
            setContractToDelete(null);
            setIsDeleteDialogOpen(false);
            await onUpdate();
        }
        catch (error) {
            console.error('Error deleting contract:', error);
            toast({
                title: "Error",
                description: "Failed to delete contract. Please try again.",
                variant: "destructive",
            });
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleUpdateWorker = async (data) => {
        try {
            setIsLoading(true);
            await api.put(`/api/workers/${worker.id}`, data);
            toast({
                title: "Success",
                description: "Worker information updated successfully",
                variant: "success",
            });
            setIsEditingWorker(false);
            await onUpdate();
        }
        catch (error) {
            toast({
                title: "Error",
                description: "Failed to update worker information",
                variant: "destructive",
            });
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleAddContract = async (data) => {
        try {
            setIsLoading(true);
            const response = await api.post(`/api/workers/${worker.id}/contracts`, data);
            if (response.data) {
                toast({
                    title: "Success",
                    description: "Contract added successfully",
                    variant: "success",
                });
                setIsAddingContract(false);
                await onUpdate();
            }
            else {
                throw new Error(response.data?.message || 'Failed to add contract');
            }
        }
        catch (error) {
            console.error('Error adding contract:', error);
            toast({
                title: "Error",
                description: error?.response?.data?.message || error?.message || "Failed to add contract",
                variant: "destructive",
            });
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleUpdateContract = async (data) => {
        if (!selectedContract)
            return;
        try {
            setIsLoading(true);
            await api.put(`/api/workers/${worker.id}/contract/${selectedContract.id}`, data);
            toast({
                title: "Success",
                description: "Contract updated successfully",
                variant: "success",
            });
            setIsEditingContract(false);
            setSelectedContract(null);
            await onUpdate();
        }
        catch (error) {
            toast({
                title: "Error",
                description: "Failed to update contract",
                variant: "destructive",
            });
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("div", { children: _jsx("h3", { className: "text-2xl font-semibold tracking-tight text-gray-900", children: "Contracts" }) }), _jsxs("div", { className: "flex gap-3", children: [_jsxs(Button, { variant: "outline", className: "border-indigo-200 text-indigo-600 hover:bg-indigo-50", size: "sm", onClick: () => setIsEditingWorker(true), children: [_jsx(Pencil, { className: "h-4 w-4 mr-2" }), "Edit"] }), _jsxs(Button, { className: "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white", size: "sm", onClick: () => setIsAddingContract(true), children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Add Contract"] })] })] }), _jsx("div", { className: "grid gap-6", children: _jsx(Card, { className: "bg-white shadow-sm border border-indigo-100", children: _jsx(CardContent, { className: "p-6", children: _jsx("div", { className: "space-y-4", children: worker.contracts && worker.contracts.length > 0 ? (worker.contracts.map((contract) => (_jsx("div", { className: "bg-gradient-to-br from-white to-indigo-50/30 rounded-lg border border-indigo-100 p-4", children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "text-sm font-medium text-gray-900", children: [contract.duration, " Month Contract"] }), _jsxs("div", { className: "text-sm text-gray-500", children: [format(new Date(contract.startDate), 'PPP'), " - ", format(new Date(contract.endDate), 'PPP')] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "outline", size: "sm", className: "h-8 border-indigo-200 text-indigo-600 hover:bg-indigo-50", onClick: () => {
                                                        setSelectedContract(contract);
                                                        setIsEditingContract(true);
                                                    }, children: _jsx(Pencil, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "outline", size: "sm", className: "h-8 border-red-200 text-red-600 hover:bg-red-50", onClick: () => {
                                                        setContractToDelete(contract);
                                                        setIsDeleteDialogOpen(true);
                                                    }, children: _jsx(Trash2, { className: "h-4 w-4" }) })] })] }) }, contract.id)))) : (_jsx("div", { className: "text-center py-6 text-gray-500", children: "No contracts found" })) }) }) }) }), _jsx(Dialog, { open: isEditingWorker, onOpenChange: setIsEditingWorker, children: _jsxs(DialogContent, { className: "sm:max-w-[425px] bg-gradient-to-br from-white to-indigo-50/30 p-0 overflow-hidden border border-indigo-100", children: [_jsx("div", { className: "bg-gradient-to-r from-indigo-500 to-purple-500 p-6", children: _jsx(DialogHeader, { className: "text-white", children: _jsx(DialogTitle, { className: "text-2xl font-bold", children: "Edit Worker" }) }) }), _jsx("div", { className: "p-6", children: _jsx(WorkerForm, { worker: worker, onSubmit: handleUpdateWorker, isLoading: isLoading }) })] }) }), _jsx(Dialog, { open: isAddingContract, onOpenChange: setIsAddingContract, children: _jsxs(DialogContent, { className: "sm:max-w-[425px] bg-gradient-to-br from-white to-indigo-50/30 p-0 overflow-hidden border border-indigo-100", children: [_jsx("div", { className: "bg-gradient-to-r from-indigo-500 to-purple-500 p-6", children: _jsx(DialogHeader, { className: "text-white", children: _jsx(DialogTitle, { className: "text-2xl font-bold", children: "New Contract" }) }) }), _jsx("div", { className: "p-6", children: _jsx(ContractForm, { onSubmit: handleAddContract, isLoading: isLoading }) })] }) }), _jsx(Dialog, { open: isEditingContract, onOpenChange: setIsEditingContract, children: _jsxs(DialogContent, { className: "sm:max-w-[425px] bg-gradient-to-br from-white to-indigo-50/30 p-0 overflow-hidden border border-indigo-100", children: [_jsx("div", { className: "bg-gradient-to-r from-indigo-500 to-purple-500 p-6", children: _jsx(DialogHeader, { className: "text-white", children: _jsx(DialogTitle, { className: "text-2xl font-bold", children: "Edit Contract" }) }) }), _jsx("div", { className: "p-6", children: selectedContract && (_jsx(ContractForm, { contract: selectedContract, onSubmit: handleUpdateContract, isLoading: isLoading })) })] }) }), _jsx(AlertDialog, { open: isDeleteDialogOpen, onOpenChange: setIsDeleteDialogOpen, children: _jsxs(AlertDialogContent, { className: "bg-white", children: [_jsxs(AlertDialogHeader, { children: [_jsx(AlertDialogTitle, { children: "Delete Contract" }), _jsx(AlertDialogDescription, { children: "Are you sure? This action cannot be undone." })] }), _jsxs(AlertDialogFooter, { children: [_jsx(AlertDialogCancel, { className: "border-gray-200", onClick: () => {
                                        setContractToDelete(null);
                                        setIsDeleteDialogOpen(false);
                                    }, children: "Cancel" }), _jsx(AlertDialogAction, { className: "bg-red-600 hover:bg-red-700 text-white", onClick: () => {
                                        if (contractToDelete) {
                                            handleDeleteContract(contractToDelete);
                                        }
                                        setIsDeleteDialogOpen(false);
                                    }, children: "Delete" })] })] }) })] }));
}
