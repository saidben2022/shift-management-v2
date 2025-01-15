interface WorkerStatisticsTableProps {
    workers: Worker[];
    shifts: Shift[];
    currentPeriodDates: {
        start: string;
        end: string;
    };
    onSetMaxHours: (data: {
        workerId: number;
        maxHours: number;
        periodStart: string;
        periodEnd: string;
    }) => Promise<void>;
    getWorkerPeriodMaxHours: (workerId: number, periodStart: string, periodEnd: string) => Promise<number | undefined>;
    isLoading: boolean;
    onSaveShift: (data: any) => Promise<void>;
}
export declare function WorkerStatisticsTable({ workers, shifts, currentPeriodDates, onSetMaxHours, getWorkerPeriodMaxHours, isLoading, onSaveShift, }: WorkerStatisticsTableProps): import("react/jsx-runtime").JSX.Element;
export {};
