// lib/hooks.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getOperators,
  getShifts,
  getShiftDetails,
  updateShift,
  recordAttendance,
  getShops,
} from './api-client';

export const useOperators = (options = {}) => {
  return useQuery({
    queryKey: ['operators'],
    queryFn: getOperators,
    ...options,
  });
};

export const useShifts = (filters: any = {}, options = {}) => {
  return useQuery({
    queryKey: ['shifts', filters],
    queryFn: () => getShifts(filters),
    ...options,
  });
};

export const useShiftDetails = (id: string, options = {}) => {
  return useQuery({
    queryKey: ['shifts', id],
    queryFn: () => getShiftDetails(id),
    enabled: !!id,
    ...options,
  });
};

export const useUpdateShift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      updateShift(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['shifts', id] });
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
    },
  });
};

export const useRecordAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ shiftId, payload }: { shiftId: string; payload: any }) =>
      recordAttendance(shiftId, payload),
    onSuccess: (_, { shiftId }) => {
      queryClient.invalidateQueries({ queryKey: ['shifts', shiftId] });
    },
  });
};

export const useShops = (options = {}) => {
  return useQuery({
    queryKey: ['shops'],
    queryFn: getShops,
    ...options,
  });
};
