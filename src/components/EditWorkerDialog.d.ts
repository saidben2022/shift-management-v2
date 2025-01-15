interface EditWorkerDialogProps {
    worker: Worker | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (worker: Worker) => Promise<void>;
}
export default function EditWorkerDialog({ worker, open, onOpenChange, onSave, }: EditWorkerDialogProps): import("react/jsx-runtime").JSX.Element | null;
export {};
