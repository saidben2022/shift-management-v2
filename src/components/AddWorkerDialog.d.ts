interface AddWorkerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (worker: Omit<Worker, "id">) => Promise<void>;
}
export default function AddWorkerDialog({ open, onOpenChange, onSave, }: AddWorkerDialogProps): import("react/jsx-runtime").JSX.Element;
export {};
