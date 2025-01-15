import * as z from "zod";
declare const formSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    workerId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    workerId: string;
    firstName: string;
    lastName: string;
}, {
    workerId: string;
    firstName: string;
    lastName: string;
}>;
export type WorkerFormData = z.infer<typeof formSchema>;
interface WorkerFormProps {
    onSubmit: (data: WorkerFormData) => void;
    isLoading: boolean;
    initialData?: WorkerFormData;
}
export default function WorkerForm({ onSubmit, isLoading, initialData }: WorkerFormProps): import("react/jsx-runtime").JSX.Element;
export {};
