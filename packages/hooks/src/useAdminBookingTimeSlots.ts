"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import {
  bookingTimeSlotsApi,
  bookingTimeSlotKeys,
  type BookingTimeSlot,
  type BookingTimeSlotListParams,
} from "@skybooking/api-client";

export function useBookingTimeSlotsQuery(params: BookingTimeSlotListParams) {
  return useQuery({
    queryKey: bookingTimeSlotKeys.list(params),
    queryFn: () => bookingTimeSlotsApi.list(params),
  });
}

export function useCreateBookingTimeSlotMutation(
  options?: UseMutationOptions<BookingTimeSlot, Error, Omit<BookingTimeSlot, "id">>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => bookingTimeSlotsApi.create(data),
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: bookingTimeSlotKeys.lists() });
      options?.onSuccess?.(...args);
    },
  });
}

export function useUpdateBookingTimeSlotMutation(
  options?: UseMutationOptions<BookingTimeSlot, Error, BookingTimeSlot>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => bookingTimeSlotsApi.update(data),
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: bookingTimeSlotKeys.lists() });
      options?.onSuccess?.(...args);
    },
  });
}

export function useDeleteBookingTimeSlotMutation(
  options?: UseMutationOptions<void, Error, number>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => bookingTimeSlotsApi.deleteOne(id),
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: bookingTimeSlotKeys.lists() });
      options?.onSuccess?.(...args);
    },
  });
}
