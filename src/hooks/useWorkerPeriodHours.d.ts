export interface WorkerPeriodHours {
    id: number;
    workerId: number;
    periodStart: string;
    periodEnd: string;
    maxHours: number;
}
interface SetWorkerPeriodHoursData {
    workerId: number;
    maxHours: number;
    periodStart: string;
    periodEnd: string;
}
export declare const getWorkerPeriodMaxHours: (workerId: number, periodStart: string, periodEnd: string) => Promise<number>;
export declare const useWorkerPeriodHours: (workerId?: number, periodStart?: string, periodEnd?: string) => {
    data: WorkerPeriodHours[] | undefined;
    isLoading: boolean;
    setWorkerPeriodHours: (data: SetWorkerPeriodHoursData) => Promise<void>;
    getWorkerPeriodMaxHours: (workerId: number, periodStart: string, periodEnd: string) => Promise<number>;
};
export {};
