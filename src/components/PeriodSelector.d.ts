interface PeriodSelectorProps {
    selectedYear: number;
    selectedPeriod: number;
    onYearChange: (year: number) => void;
    onPeriodChange: (period: number) => void;
}
export declare function PeriodSelector({ selectedYear, selectedPeriod, onYearChange, onPeriodChange }: PeriodSelectorProps): import("react/jsx-runtime").JSX.Element;
export {};
