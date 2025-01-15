import "react-datepicker/dist/react-datepicker.css";
import { Worker } from '@/types/Worker';
import { Shift } from '@/types/Shift';
interface WorkerScheduleViewProps {
    workers: Worker[];
    shifts: Shift[];
}
export declare function WorkerScheduleView({ workers, shifts }: WorkerScheduleViewProps): import("react/jsx-runtime").JSX.Element;
export {};
