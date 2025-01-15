import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Dialog as AlertDialog, DialogContent as AlertDialogContent, DialogDescription as AlertDialogDescription, DialogFooter as AlertDialogFooter, DialogHeader as AlertDialogHeader, DialogTitle as AlertDialogTitle, } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
export function DeleteConfirmationDialog({ open, onOpenChange, onConfirm, isDeleting }) {
    const { t } = useTranslation();
    const handleConfirm = () => {
        onConfirm();
        onOpenChange(false);
    };
    return (_jsx(AlertDialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(AlertDialogContent, { children: [_jsxs(AlertDialogHeader, { children: [_jsx(AlertDialogTitle, { children: t('dialog.deleteConfirmation.title') }), _jsx(AlertDialogDescription, { children: t('dialog.deleteConfirmation.message') })] }), _jsxs(AlertDialogFooter, { className: "flex justify-end space-x-2", children: [_jsxs(Button, { className: "px-4 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 border border-gray-300 shadow-sm transition-all duration-200 hover:text-gray-900", onClick: () => onOpenChange(false), disabled: isDeleting, children: [_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "mr-2", children: [_jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }), _jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })] }), t('common.cancel')] }), _jsx(Button, { variant: "destructive", onClick: handleConfirm, disabled: isDeleting, className: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-sm transition-all duration-200 flex items-center gap-2", children: isDeleting ? t('common.deleting') : t('common.delete') })] })] }) }));
}
export default DeleteConfirmationDialog;
