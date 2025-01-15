import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { UserIcon, MapPinIcon, ClockIcon, ChevronRightIcon, Users2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Shift, ShiftType } from '@/types/Shift';
import { cn } from "@/lib/utils";

interface DayWorkersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date;
  shifts: Shift[];
}

export function DayWorkersDialog({
  open,
  onOpenChange,
  selectedDate,
  shifts,
}: DayWorkersDialogProps) {
  const { t } = useTranslation();

  const dayShifts = shifts.filter(shift => {
    const shiftStart = new Date(shift.startTime);
    const shiftEnd = new Date(shift.endTime);
    const currentDate = new Date(selectedDate);
    
    // Set all dates to midnight for proper comparison
    currentDate.setHours(0, 0, 0, 0);
    const startDate = new Date(shiftStart);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(shiftEnd);
    endDate.setHours(0, 0, 0, 0);

    // For leave types, check if the date falls within the range
    if ([ShiftType.VACATION, ShiftType.SICK_LEAVE, ShiftType.UNPAID_LEAVE].includes(shift.shiftType)) {
      return currentDate >= startDate && currentDate <= endDate;
    }
    
    // For work shifts, check if it's on the same day
    return currentDate.getTime() === startDate.getTime();
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 bg-gradient-to-br from-white to-indigo-50/30 border border-indigo-100 overflow-hidden max-w-2xl">
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6">
          <DialogHeader className="text-white">
            <DialogTitle className="text-2xl font-bold">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </DialogTitle>
            <DialogDescription className="text-indigo-100">
              {dayShifts.length} {t('shifts.count')}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          {dayShifts.map((shift) => (
            <div
              key={shift.id}
              className="group rounded-lg border border-indigo-100 bg-white p-4 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-0.5">
                    <div className="rounded-full bg-white p-2">
                      <UserIcon className="h-5 w-5 text-indigo-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {shift.worker?.firstName} {shift.worker?.lastName}
                    </h3>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "transition-colors",
                          shift.shiftType === ShiftType.NORMAL_WORKDAY && "bg-green-50 text-green-700 border-green-200 group-hover:bg-green-100",
                          shift.shiftType === ShiftType.WEEKEND_DAY && "bg-blue-50 text-blue-700 border-blue-200 group-hover:bg-blue-100",
                          shift.shiftType === ShiftType.HOLIDAY && "bg-purple-50 text-purple-700 border-purple-200 group-hover:bg-purple-100",
                          shift.shiftType === ShiftType.SICK_LEAVE && "bg-red-50 text-red-700 border-red-200 group-hover:bg-red-100",
                          shift.shiftType === ShiftType.VACATION && "bg-orange-50 text-orange-700 border-orange-200 group-hover:bg-orange-100",
                          shift.shiftType === ShiftType.UNPAID_LEAVE && "bg-gray-50 text-gray-700 border-gray-200 group-hover:bg-gray-100"
                        )}
                      >
                        {t(`shifts.types.${shift.shiftType.toLowerCase()}`)}
                      </Badge>
                      {shift.location && (
                        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 group-hover:bg-indigo-100">
                          <MapPinIcon className="mr-1 h-3 w-3" />
                          {shift.location}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className="bg-indigo-50 text-indigo-700 border-indigo-200 group-hover:bg-indigo-100 flex items-center gap-1"
                  >
                    <ClockIcon className="h-3.5 w-3.5" />
                    {shift.hoursWorked} {t('shifts.hours')}
                  </Badge>
                </div>
              </div>
            </div>
          ))}

          {dayShifts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-gray-100/80 p-4 mb-4">
                <Users2 className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">{t('shifts.noShiftsForDay')}</p>
              <p className="text-gray-500 text-sm mt-1">{t('shifts.tryAnotherDay')}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
