import { jsx as _jsx } from "react/jsx-runtime";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "../../lib/utils";
import { buttonVariants } from "./button";
function Calendar({ className, classNames, showOutsideDays = true, ...props }) {
    return (_jsx(DayPicker, { showOutsideDays: showOutsideDays, className: cn("p-3", className), classNames: {
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center px-8",
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center",
            nav_button: cn(buttonVariants({ variant: "outline" }), "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"),
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "grid grid-cols-7",
            head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] text-center",
            row: "grid grid-cols-7 mt-2",
            cell: cn("relative p-0 text-center text-sm focus-within:relative focus-within:z-20", props.mode === "range"
                ? "[&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
                : "[&:has([aria-selected])]:bg-accent"),
            day: cn(buttonVariants({ variant: "ghost" }), "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground"),
            day_range_end: "day-range-end",
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "border border-primary text-primary",
            day_outside: "text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-50",
            day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
            day_hidden: "invisible",
            ...classNames,
        }, components: {
            IconLeft: ({ ...props }) => _jsx(ChevronLeft, { className: "h-4 w-4" }),
            IconRight: ({ ...props }) => _jsx(ChevronRight, { className: "h-4 w-4" }),
        }, ...props }));
}
Calendar.displayName = "Calendar";
export { Calendar };
