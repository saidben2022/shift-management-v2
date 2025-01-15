import { useState } from 'react';
import { useToast } from '../components/ui/use-toast';
import { api } from '../lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface WorkerPeriodHours {
  id: number;
  workerId: number;
  periodStart: string;
  periodEnd: string;
  maxHours: number;
}

interface SetWorkerPeriodHoursData {
  workerId: number;
  maxHours: number;
  periodStart: string;
  periodEnd: string;
}

export const getWorkerPeriodMaxHours = async (workerId: number, periodStart: string, periodEnd: string): Promise<number> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No auth token found');
    }

    // Ensure dates are valid
    const startDate = new Date(periodStart);
    const endDate = new Date(periodEnd);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.error('Invalid dates:', { periodStart, periodEnd });
      return 0;
    }

    // Convert dates to ISO strings
    const formattedStart = startDate.toISOString();
    const formattedEnd = endDate.toISOString();

    console.log('Fetching period hours:', { 
      workerId, 
      periodStart: formattedStart,
      periodEnd: formattedEnd,
      startDate,
      endDate
    });

    const response = await api.get<{ maxHours: number }>(
      '/api/worker-period-hours',
      {
        params: {
          workerId,
          periodStart: formattedStart,
          periodEnd: formattedEnd
        }
      }
    );

    console.log('Received response:', response.data);
    return response.data.maxHours;
  } catch (error) {
    console.error('Error getting worker period hours:', error);
    return 0;
  }
};

export const useWorkerPeriodHours = (workerId?: number, periodStart?: string, periodEnd?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ['workerPeriodHours', workerId, periodStart, periodEnd],
    queryFn: async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No auth token found');
        }

        // If we have specific parameters, use them
        if (workerId && periodStart && periodEnd) {
          // Convert dates to ISO strings
          const startDate = new Date(periodStart);
          const endDate = new Date(periodEnd);
          const formattedStart = startDate.toISOString();
          const formattedEnd = endDate.toISOString();

          const response = await api.get<WorkerPeriodHours[]>('/api/worker-period-hours', {
            params: {
              workerId,
              periodStart: formattedStart,
              periodEnd: formattedEnd
            }
          });
          return response.data;
        } else {
          // Get all worker period hours if no specific parameters
          const response = await api.get<WorkerPeriodHours[]>('/api/worker-period-hours', {
            params: {
              periodStart,
              periodEnd
            }
          });
          return response.data;
        }
      } catch (error) {
        console.error('Error fetching worker period hours:', error);
        return [];
      }
    },
    enabled: !!(workerId && periodStart && periodEnd) // Only run the query if we have all required parameters
  });

  const mutation = useMutation({
    mutationFn: async (data: SetWorkerPeriodHoursData) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No auth token found');
        }

        if (!data.periodStart || !data.periodEnd) {
          console.error('Invalid period dates:', { periodStart: data.periodStart, periodEnd: data.periodEnd });
          throw new Error('Invalid period dates');
        }

        // Ensure dates are valid
        const startDate = new Date(data.periodStart);
        const endDate = new Date(data.periodEnd);
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          console.error('Invalid dates:', { periodStart: data.periodStart, periodEnd: data.periodEnd });
          throw new Error('Invalid dates');
        }

        // Convert dates to ISO strings
        const formattedStart = startDate.toISOString();
        const formattedEnd = endDate.toISOString();

        console.log('Saving period hours with dates:', { 
          workerId: data.workerId,
          maxHours: data.maxHours,
          periodStart: formattedStart,
          periodEnd: formattedEnd
        });

        const requestData = {
          workerId: Number(data.workerId),
          maxHours: Number(data.maxHours),
          periodStart: formattedStart,
          periodEnd: formattedEnd
        };

        const response = await api.post<WorkerPeriodHours>(
          '/api/worker-period-hours',
          requestData
        );
        
        // Invalidate queries immediately
        await queryClient.invalidateQueries({ 
          queryKey: ['workerPeriodHours', data.workerId.toString(), formattedStart, formattedEnd] 
        });

        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.message || error.message;
          throw new Error(message);
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Period hours updated successfully",
        variant: "success",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to set period hours",
        variant: "destructive",
      });
    }
  });

  const setWorkerPeriodHours = async (data: SetWorkerPeriodHoursData) => {
    try {
      await mutation.mutateAsync(data);
      queryClient.invalidateQueries({ queryKey: ['workerPeriodHours'] });
      toast({
        title: 'Success',
        description: 'Worker period hours updated successfully',
      });
    } catch (error) {
      console.error('Error setting worker period hours:', error);
      toast({
        title: 'Error',
        description: 'Failed to update worker period hours',
        variant: 'destructive',
      });
    }
  };

  return {
    data,
    isLoading,
    setWorkerPeriodHours,
    getWorkerPeriodMaxHours,
  };
};
