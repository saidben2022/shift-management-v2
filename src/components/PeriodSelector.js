import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { getPeriods, formatDate } from '../lib/utils';
import { Label } from './ui/label';
export function PeriodSelector({ selectedYear, selectedPeriod, onYearChange, onPeriodChange }) {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
    const periods = getPeriods(selectedYear);
    return (_jsxs("div", { className: "flex gap-4 items-end", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Year" }), _jsxs(Select, { value: selectedYear.toString(), onValueChange: (value) => onYearChange(parseInt(value)), children: [_jsx(SelectTrigger, { className: "w-[120px]", children: _jsx(SelectValue, { placeholder: "Select year" }) }), _jsx(SelectContent, { children: years.map((year) => (_jsx(SelectItem, { value: year.toString(), children: year }, year))) })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Period" }), _jsxs(Select, { value: selectedPeriod.toString(), onValueChange: (value) => onPeriodChange(parseInt(value)), children: [_jsx(SelectTrigger, { className: "w-[200px]", children: _jsx(SelectValue, { placeholder: "Select period" }) }), _jsx(SelectContent, { children: periods.map((period, index) => (_jsx(SelectItem, { value: (index + 1).toString(), children: `${period.label} (${formatDate(period.start)} - ${formatDate(period.end)})` }, index + 1))) })] })] })] }));
}
