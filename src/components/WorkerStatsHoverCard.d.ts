import React from 'react';
import { Worker } from '@/types/Worker';
import { Shift } from '@/types/Shift';
interface WorkerStatsHoverCardProps {
    worker: Worker;
    shifts: Shift[];
    periodStart: string;
    periodEnd: string;
    periodHours?: number;
    children: React.ReactNode;
}
export declare function WorkerStatsHoverCard({ worker, shifts, periodStart, periodEnd, periodHours, children }: WorkerStatsHoverCardProps): import("react/jsx-runtime").JSX.Element;
export {};
