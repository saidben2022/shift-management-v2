interface DeleteConfirmationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isDeleting: boolean;
}
export declare function DeleteConfirmationDialog({ open, onOpenChange, onConfirm, isDeleting }: DeleteConfirmationDialogProps): import("react/jsx-runtime").JSX.Element;
export default DeleteConfirmationDialog;
