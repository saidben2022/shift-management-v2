import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shift } from '@/types/Shift';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';

export function useShifts() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { toast } = useToast();

  const { data: shifts = [], isLoading, error } = useQuery({
    queryKey: ['shifts'],
    queryFn: async () => {
      const response = await api.get<Shift[]>('/api/shifts');
      return response.data.map(shift => ({
        ...shift,
        startTime: new Date(shift.startTime).toISOString(),
        endTime: new Date(shift.endTime).toISOString()
      }));
    },
    staleTime: 30000,
    cacheTime: 3600000,
  });

  const addShiftMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log('Sending shift data:', data);
      const requestData = {
        ...data,
        workerId: Number(data.workerId)
      };
      const response = await api.post<Shift>('/api/shifts', requestData);
      console.log('Shift created:', response.data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      toast({
        title: t('shifts.toast.addSuccess'),
        variant: 'success',
      });
    },
    onError: (error: any) => {
      console.error('Error response:', error.response?.data);
      toast({
        title: t('shifts.toast.addError'),
        description: error.response?.data?.message || t('common.error'),
        variant: 'destructive',
      });
      throw error;
    }
  });

  const deleteShiftMutation = useMutation({
    mutationFn: async (shiftId: number) => {
      await api.delete(`/api/shifts/${shiftId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      toast({
        title: t('shifts.toast.deleteSuccess'),
        variant: 'success',
      });
    },
    onError: () => {
      toast({
        title: t('shifts.toast.deleteError'),
        variant: 'destructive',
      });
    }
  });

  return {
    shifts,
    isLoading,
    error,
    addShift: addShiftMutation.mutateAsync,
    deleteShift: deleteShiftMutation.mutateAsync
  };
}
