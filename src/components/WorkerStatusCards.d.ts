import { Worker } from "@/types/Worker";
import { Shift } from "@/types/Shift";
interface WorkerStatusCardsProps {
    workers: Worker[];
    shifts: Shift[];
    currentPeriodDates: {
        start: Date;
        end: Date;
    };
}
export declare function WorkerStatusCards({ workers, shifts, currentPeriodDates }: WorkerStatusCardsProps): import("react/jsx-runtime").JSX.Element;
export {};
