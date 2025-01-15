import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { format, startOfDay, endOfDay } from 'date-fns';
import { nl } from 'date-fns/locale';
import { nlBE } from 'date-fns/locale'; // Add Dutch locale import for date-fns
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { CalendarIcon, Users2, MapPinIcon, UserIcon, ClockIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Worker } from '@/types/Worker';
import { Shift, ShiftType } from '@/types/Shift';
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/TableSkeleton";

interface WorkerScheduleViewProps {
  workers: Worker[];
  shifts: Shift[];
}

export function WorkerScheduleView({ workers, shifts }: WorkerScheduleViewProps) {
  const { t, i18n } = useTranslation();
  const today = new Date();
  const [startDate, setStartDate] = useState<Date>(startOfDay(today));
  const [endDate, setEndDate] = useState<Date>(endOfDay(today));
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [groupByLocation, setGroupByLocation] = useState(false);

  // Get unique locations from shifts
  const locations = useMemo(() => {
    const uniqueLocations = new Set<string>();
    shifts.forEach(shift => {
      if (shift.location) {
        uniqueLocations.add(shift.location);
      }
    });
    return Array.from(uniqueLocations);
  }, [shifts]);

  // Filter shifts based on date range and location
  const filteredShifts = useMemo(() => {
    return shifts.filter(shift => {
      if (!shift.startTime || !shift.endTime) return false;
      
      try {
        const shiftStart = new Date(shift.startTime);
        const shiftEnd = new Date(shift.endTime);
        
        if (isNaN(shiftStart.getTime()) || isNaN(shiftEnd.getTime())) return false;
        
        const isInDateRange = shiftStart >= startDate && shiftEnd <= endDate;
        const isInLocation = selectedLocation === 'all' || shift.location === selectedLocation;
        
        return isInDateRange && isInLocation;
      } catch (error) {
        console.error('Error processing shift dates:', error);
        return false;
      }
    });
  }, [shifts, startDate, endDate, selectedLocation]);

  // Group shifts by worker or location
  const groupedShifts = useMemo(() => {
    if (groupByLocation) {
      const byLocation: { [key: string]: Shift[] } = {};
      filteredShifts.forEach(shift => {
        const location = shift.location || 'Unknown';
        if (!byLocation[location]) {
          byLocation[location] = [];
        }
        byLocation[location].push(shift);
      });
      return byLocation;
    } else {
      const byWorker: { [key: number]: Shift[] } = {};
      filteredShifts.forEach(shift => {
        if (shift.worker) {
          if (!byWorker[shift.worker.id]) {
            byWorker[shift.worker.id] = [];
          }
          byWorker[shift.worker.id].push(shift);
        }
      });
      return byWorker;
    }
  }, [filteredShifts, groupByLocation]);

  const getShiftTypeBadge = (shiftType: ShiftType) => {
    const variants = {
      [ShiftType.NORMAL_WORKDAY]: {
        variant: "default",
        className: "bg-green-50 text-green-800 border-green-200 hover:bg-green-100"
      },
      [ShiftType.WEEKEND_DAY]: {
        variant: "secondary",
        className: "bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100"
      },
      [ShiftType.HOLIDAY]: {
        variant: "destructive",
        className: "bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100"
      },
      [ShiftType.SICK_LEAVE]: {
        variant: "warning",
        className: "bg-red-50 text-red-800 border-red-200 hover:bg-red-100"
      },
      [ShiftType.VACATION]: {
        variant: "success",
        className: "bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100"
      },
      [ShiftType.UNPAID_LEAVE]: {
        variant: "outline",
        className: "bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100"
      }
    };

    const style = variants[shiftType];
    return (
      <Badge variant={style.variant as any} className={style.className}>
        {t(`shifts.types.${shiftType.toLowerCase()}`)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      return format(date, 'PP');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      return format(date, 'p');
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Invalid time';
    }
  };

  const isLoading = false;

  const locale = i18n.language === 'nl' ? nlBE : undefined; // Update locale to use nlBE

  return (
    <div className="space-y-6">
      {/* Header Section with Gradient Background */}
      <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-6 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Start Date Picker */}
          <div className="grid gap-3">
            <Label className="text-sm font-medium text-white">{t('shifts.fields.startDate')}</Label>
            <div className="relative">
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => date && setStartDate(startOfDay(date))}
                className={cn(
                  "w-full rounded-lg border-0 bg-white/10 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder:text-white/70",
                  "focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-0",
                  "disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
                  "hover:bg-white/20 transition-colors",
                  "pl-10"
                )}
                dateFormat="yyyy-MM-dd"
                placeholderText={t('shifts.fields.selectStartDate')}
                locale={locale}
                popperClassName="date-picker-popper"
                popperPlacement="bottom"
                popperProps={{
                  positionFixed: true,
                  strategy: "fixed"
                }}
                portalId="calendar-portal"
              />
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
            </div>
          </div>

          {/* End Date Picker */}
          <div className="grid gap-3">
            <Label className="text-sm font-medium text-white">{t('shifts.fields.endDate')}</Label>
            <div className="relative">
              <DatePicker
                selected={endDate}
                onChange={(date: Date | null) => date && setEndDate(endOfDay(date))}
                minDate={startDate}
                className={cn(
                  "w-full rounded-lg border-0 bg-white/10 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder:text-white/70",
                  "focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-0",
                  "disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
                  "hover:bg-white/20 transition-colors",
                  "pl-10"
                )}
                dateFormat="yyyy-MM-dd"
                placeholderText={t('shifts.fields.selectEndDate')}
                locale={locale}
                popperClassName="date-picker-popper"
                popperPlacement="bottom"
                popperProps={{
                  positionFixed: true,
                  strategy: "fixed"
                }}
                portalId="calendar-portal"
              />
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
            </div>
          </div>

          {/* Location Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-white">{t('shifts.fields.location')}</Label>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="border-0 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors focus:ring-white/50">
                <div className="flex items-center gap-2">
                  {/* <MapPinIcon className="h-4 w-4 text-white/70" /> */}
                  <SelectValue placeholder={t('shifts.fields.selectLocation')} />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-gradient-to-b from-blue-500 to-indigo-500 border-0 text-white">
                <SelectItem value="all" className="focus:bg-white/20 focus:text-white">
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 text-white/70" />
                    {t('shifts.fields.selectLocation')}
                  </div>
                </SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location} className="focus:bg-white/20 focus:text-white">
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4 text-white" />
                      {location}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Group By Toggle */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-white">{t('shifts.grouping.groupBy')}</Label>
            <Select 
              value={groupByLocation ? 'location' : 'worker'} 
              onValueChange={(value) => setGroupByLocation(value === 'location')}
            >
              <SelectTrigger className="border-0 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors focus:ring-white/50">
                <div className="flex items-center gap-2">
                  {groupByLocation ? (
                    <MapPinIcon className="h-4 w-4 text-white" />
                  ) : (
                    <UserIcon className="h-4 w-4 text-white" />
                  )}
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-gradient-to-b from-blue-500 to-indigo-500 border-0 text-white">
                <SelectItem value="worker" className="focus:bg-white/20 focus:text-white">
                  <div className="flex items-center gap-2">
                    {/* <UserIcon className="h-4 w-4 text-white" /> */}
                    {t('shifts.grouping.groupByWorker')}
                  </div>
                </SelectItem>
                <SelectItem value="location" className="focus:bg-white/20 focus:text-white">
                  <div className="flex items-center gap-2">
                    {/* <MapPinIcon className="h-4 w-4 text-white" /> */}
                    {t('shifts.grouping.groupByLocation')}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Groups Section */}
      <div className="grid gap-6">
        {Object.entries(groupedShifts).map(([key, shifts]) => (
          <div key={key} className="rounded-lg border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {groupByLocation ? (
                    <div className="rounded-full bg-blue-100 p-2">
                      <MapPinIcon className="h-5 w-5 text-blue-600" />
                    </div>
                  ) : (
                    <div className="rounded-full bg-purple-100 p-2">
                      <UserIcon className="h-5 w-5 text-purple-600" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{key}</h3>
                    <p className="text-sm text-gray-500">
                      {shifts.length} {t('shifts.count')}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {shifts.reduce((acc, shift) => acc + (shift.hoursWorked || 0), 0)} {t('shifts.hours')}
                </Badge>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-blue-50 to-blue-100/50 hover:bg-blue-100/50">
                  <TableHead className="font-semibold text-blue-900">{t('shifts.fields.date')}</TableHead>
                  <TableHead className="font-semibold text-blue-900">
                    {groupByLocation ? t('workers.fields.fullName') : t('shifts.fields.location')}
                  </TableHead>
                  <TableHead className="font-semibold text-blue-900">{t('shifts.fields.type')}</TableHead>
                  <TableHead className="font-semibold text-blue-900 text-right">{t('shifts.fields.hours')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shifts.map((shift) => (
                  <TableRow
                    key={shift.id}
                    className={cn(
                      "hover:bg-gray-50/80 transition-colors duration-150",
                      shift.shiftType === ShiftType.VACATION && "bg-green-50/30 hover:bg-green-50/50",
                      shift.shiftType === ShiftType.SICK_LEAVE && "bg-orange-50/30 hover:bg-orange-50/50",
                      shift.shiftType === ShiftType.UNPAID_LEAVE && "bg-yellow-50/30 hover:bg-yellow-50/50",
                      shift.shiftType === ShiftType.HOLIDAY && "bg-purple-50/30 hover:bg-purple-50/50",
                      shift.shiftType === ShiftType.WEEKEND_DAY && "bg-blue-50/30 hover:bg-blue-50/50"
                    )}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gray-100/50 flex items-center justify-center">
                          <CalendarIcon className="h-4 w-4 text-gray-600" />
                        </div>
                        <span className="font-medium text-gray-700">
                          {format(new Date(shift.startTime), 'EEEE, d MMMM yyyy', { locale })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {groupByLocation ? (
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-purple-100/50 flex items-center justify-center">
                            <UserIcon className="h-4 w-4 text-purple-600" />
                          </div>
                          <span className="text-gray-700">{`${shift.worker?.firstName} ${shift.worker?.lastName}`}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-blue-100/50 flex items-center justify-center">
                            <MapPinIcon className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="text-gray-700">{shift.location || '-'}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {getShiftTypeBadge(shift.shiftType)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <div className="h-7 w-7 rounded-full bg-gray-100/50 flex items-center justify-center">
                          <ClockIcon className="h-4 w-4 text-gray-600" />
                        </div>
                        {shift.hoursWorked ? (
                          <span className="text-gray-700">
                            {shift.hoursWorked.toFixed(1)}
                          </span>
                        ) : '-'}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))}
      </div>
    </div>
  );
}
