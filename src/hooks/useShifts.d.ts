export declare function useShifts(): {
    shifts: any;
    isLoading: false;
    error: Error | null;
    addShift: import("@tanstack/react-query").UseMutateAsyncFunction<any, any, any, unknown>;
    deleteShift: import("@tanstack/react-query").UseMutateAsyncFunction<void, Error, number, unknown>;
};
