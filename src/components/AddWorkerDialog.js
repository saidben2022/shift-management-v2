import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { useState } from "react";
export default function AddWorkerDialog({ open, onOpenChange, onSave, }) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        workerId: "",
        email: "",
        phone: "",
        address: "",
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSave(formData);
        setFormData({
            firstName: "",
            lastName: "",
            workerId: "",
            email: "",
            phone: "",
            address: "",
        });
    };
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: "sm:max-w-[425px]", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: t("workers.management.addNewWorker") }), _jsx(DialogDescription, { children: t("workers.management.fillDetails") })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "grid gap-4", children: [_jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "firstName", children: t("workers.form.firstName") }), _jsx(Input, { id: "firstName", value: formData.firstName, onChange: (e) => setFormData({ ...formData, firstName: e.target.value }), required: true })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "lastName", children: t("workers.form.lastName") }), _jsx(Input, { id: "lastName", value: formData.lastName, onChange: (e) => setFormData({ ...formData, lastName: e.target.value }), required: true })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "workerId", children: t("workers.form.workerId") }), _jsx(Input, { id: "workerId", value: formData.workerId, onChange: (e) => setFormData({ ...formData, workerId: e.target.value }), required: true })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "email", children: t("workers.form.email") }), _jsx(Input, { id: "email", type: "email", value: formData.email, onChange: (e) => setFormData({ ...formData, email: e.target.value }) })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "phone", children: t("workers.form.phone") }), _jsx(Input, { id: "phone", type: "tel", value: formData.phone, onChange: (e) => setFormData({ ...formData, phone: e.target.value }) })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "address", children: t("workers.form.address") }), _jsx(Input, { id: "address", value: formData.address, onChange: (e) => setFormData({ ...formData, address: e.target.value }) })] })] }), _jsxs("div", { className: "flex justify-end space-x-2", children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), children: t("common.cancel") }), _jsx(Button, { type: "submit", children: t("common.save") })] })] })] }) }));
}
