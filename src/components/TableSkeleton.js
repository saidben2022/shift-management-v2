import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
export function TableSkeleton({ columns, rows = 5 }) {
    return (_jsx("div", { className: "rounded-md border", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsx(TableRow, { className: "bg-muted/50", children: Array.from({ length: columns }).map((_, i) => (_jsx(TableHead, { children: _jsx(Skeleton, { className: "h-4 w-24" }) }, i))) }) }), _jsx(TableBody, { children: Array.from({ length: rows }).map((_, rowIndex) => (_jsx(TableRow, { children: Array.from({ length: columns }).map((_, colIndex) => (_jsx(TableCell, { children: _jsx(Skeleton, { className: "h-4 w-full" }) }, colIndex))) }, rowIndex))) })] }) }));
}
