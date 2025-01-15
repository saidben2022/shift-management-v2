import React from 'react';
import { Worker } from '@/types/Worker';
import { Shift } from '@/types/Shift';
interface WorkerDetailsPopoverProps {
    worker: Worker;
    shifts: Shift[];
    periodStart: string;
    periodEnd: string;
    children: React.ReactNode;
    periodHours?: number;
}
export declare function WorkerDetailsPopover({ worker, shifts, periodStart, periodEnd, children, periodHours }: WorkerDetailsPopoverProps): import("react/jsx-runtime").JSX.Element;
export {};
