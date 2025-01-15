import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog";
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
export function ShiftDetailsDialog({ shift, open, onOpenChange, onDelete, }) {
    const { t } = useTranslation();
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
    const handleDelete = async () => {
        if (!shift)
            return;
        setIsDeleting(true);
        try {
            await onDelete(shift.id);
            setShowDeleteConfirm(false);
            onOpenChange(false);
        }
        finally {
            setIsDeleting(false);
        }
    };
    const formatShiftTime = (shift) => {
        const isWorkShift = ['NORMAL_WORKDAY', 'WEEKEND_DAY', 'HOLIDAY'].includes(shift.shiftType);
        if (isWorkShift) {
            return `${shift.hoursWorked} ${t('shifts.details.labels.hours')}`;
        }
        else {
            const startDate = new Date(shift.startTime);
            const endDate = new Date(shift.endTime);
            const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
            return `${diffDays} ${diffDays === 1 ? t('shifts.details.labels.day') : t('shifts.details.labels.days')} (${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')})`;
        }
    };
    const formatShiftType = (shiftType) => {
        return shiftType.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    };
    if (!shift)
        return null;
    return (_jsx(_Fragment, { children: _jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: "p-0 bg-gradient-to-br from-white to-indigo-50/30 border border-indigo-100 overflow-hidden", children: [_jsx("div", { className: "bg-gradient-to-r from-indigo-500 to-purple-500 p-6", children: _jsxs(DialogHeader, { className: "text-white", children: [_jsx(DialogTitle, { className: "text-2xl font-bold", children: t('shifts.details.title') }), _jsx(DialogDescription, { className: "text-indigo-100", children: t('shifts.details.description') })] }) }), _jsx("div", { className: "p-6 space-y-6", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx("h4", { className: "text-sm font-medium text-gray-500", children: t('shifts.details.labels.worker') }), _jsxs("p", { className: "text-base font-medium text-gray-900", children: [shift.worker?.firstName, " ", shift.worker?.lastName] })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx("h4", { className: "text-sm font-medium text-gray-500", children: t('shifts.details.labels.shiftType') }), _jsx("div", { className: cn("inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium", "bg-indigo-50 text-indigo-700 border border-indigo-200"), children: t(`shifts.shiftTypes.${shift.shiftType}`) })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx("h4", { className: "text-sm font-medium text-gray-500", children: t('shifts.details.labels.duration') }), _jsx("p", { className: "text-base text-gray-900", children: formatShiftTime(shift) })] }), shift.location && (_jsxs("div", { className: "space-y-1.5", children: [_jsx("h4", { className: "text-sm font-medium text-gray-500", children: t('shifts.details.labels.location') }), _jsx("p", { className: "text-base text-gray-900", children: shift.location })] }))] }) }), _jsx(DialogFooter, { className: "p-6 pt-0", children: _jsxs(AlertDialog, { open: showDeleteConfirm, onOpenChange: setShowDeleteConfirm, children: [_jsx(AlertDialogTrigger, { asChild: true, children: _jsxs(Button, { variant: "destructive", disabled: isDeleting, className: cn("bg-gradient-to-r from-red-500 to-red-600", "hover:from-red-600 hover:to-red-700", "text-white shadow-md hover:shadow-lg", "transition-all duration-200"), children: [_jsx(Trash2, { className: "w-4 h-4 mr-2" }), isDeleting ? t('shifts.details.delete.deleting') : t('shifts.details.delete.button')] }) }), _jsxs(AlertDialogContent, { className: "bg-gradient-to-br from-white to-red-50/30 border border-red-100", children: [_jsxs(AlertDialogHeader, { children: [_jsx(AlertDialogTitle, { className: "text-xl font-semibold text-gray-900", children: t('shifts.details.delete.title') }), _jsx(AlertDialogDescription, { className: "text-gray-500", children: t('shifts.details.delete.description') })] }), _jsxs(AlertDialogFooter, { children: [_jsx(AlertDialogCancel, { className: "bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-600 border border-gray-300", children: t('shifts.details.delete.cancel') }), _jsx(AlertDialogAction, { onClick: handleDelete, disabled: isDeleting, className: cn("bg-gradient-to-r from-red-500 to-red-600", "hover:from-red-600 hover:to-red-700", "text-white shadow-md hover:shadow-lg", "transition-all duration-200"), children: isDeleting ? t('shifts.details.delete.deleting') : t('shifts.details.delete.confirm') })] })] })] }) })] }) }) }));
}
