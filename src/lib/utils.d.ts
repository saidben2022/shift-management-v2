import { type ClassValue } from "clsx";
export declare function cn(...inputs: ClassValue[]): string;
export declare function getFirstMondayOfYear(year: number): Date;
export declare function getPeriods(year: number): {
    start: Date;
    end: Date;
    label: string;
    weeks: number[];
}[];
export declare function getCurrentPeriod(date?: Date): number;
export declare function formatDate(date: Date): string;
export declare function getPeriodsAlternative(year: number): {
    start: string;
    end: string;
    weeks: number[];
}[];
