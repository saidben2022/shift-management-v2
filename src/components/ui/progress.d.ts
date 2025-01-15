import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
declare const Progress: React.ForwardRefExoticComponent<Omit<ProgressPrimitive.ProgressProps & React.RefAttributes<HTMLDivElement>, "ref"> & {
    indicatorClassName?: string;
} & React.RefAttributes<HTMLDivElement>>;
export { Progress };
