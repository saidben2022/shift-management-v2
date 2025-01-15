import * as z from "zod";
import "react-datepicker/dist/react-datepicker.css";
declare const formSchema: z.ZodObject<{
    startDate: z.ZodDate;
    duration: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    duration: number;
    startDate: Date;
}, {
    duration: number;
    startDate: Date;
}>;
export type ContractFormData = z.infer<typeof formSchema>;
interface ContractFormProps {
    contract?: {
        startDate: string;
        duration: number;
    };
    onSubmit: (data: ContractFormData) => void;
    isLoading: boolean;
}
export default function ContractForm({ contract, onSubmit, isLoading }: ContractFormProps): import("react/jsx-runtime").JSX.Element;
export {};
