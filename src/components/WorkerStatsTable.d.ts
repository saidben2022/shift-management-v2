interface WorkerStatsTableProps {
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
    showStatusCards?: boolean;
}
export declare function WorkerStatsTable({ workers, shifts, currentPeriodDates, onSetMaxHours, getWorkerPeriodMaxHours, showStatusCards }: WorkerStatsTableProps): import("react/jsx-runtime").JSX.Element;
export {};
