import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "./ui/table";
export function WorkerContractsTable({ contracts }) {
    return (_jsx("div", { className: "rounded-md border", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Contract Type" }), _jsx(TableHead, { children: "Start Date" }), _jsx(TableHead, { children: "End Date" }), _jsx(TableHead, { children: "Hours Per Period" }), _jsx(TableHead, { children: "Status" })] }) }), _jsxs(TableBody, { children: [contracts.map((contract) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: contract.type }), _jsx(TableCell, { children: new Date(contract.startDate).toLocaleDateString() }), _jsx(TableCell, { children: contract.endDate
                                        ? new Date(contract.endDate).toLocaleDateString()
                                        : 'Ongoing' }), _jsx(TableCell, { children: contract.hoursPerPeriod }), _jsx(TableCell, { children: new Date(contract.endDate) < new Date() ? 'Completed' : 'Active' })] }, contract.id))), contracts.length === 0 && (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 5, className: "text-center", children: "No contracts found" }) }))] })] }) }));
}
export default WorkerContractsTable;
