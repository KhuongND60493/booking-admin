"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import {
  bookingTablesApi,
  bookingTableKeys,
  type BookingTableListParams,
  type BookingTableRow,
  type CreateBookingTablePayload,
  type UpdateBookingTablePayload,
} from "@skybooking/api-client";

export function useBookingTablesQuery(params: BookingTableListParams) {
  const storeIds = params.storeIds ?? [];

  return useQuery({
    queryKey: bookingTableKeys.list(params),
    queryFn: () => bookingTablesApi.list(params),
    enabled: storeIds.length > 0,
  });
}

export function useCreateBookingTableMutation(
  options?: UseMutationOptions<BookingTableRow, Error, CreateBookingTablePayload>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => bookingTablesApi.create(data),
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: bookingTableKeys.lists() });
      options?.onSuccess?.(...args);
    },
  });
}

export function useUpdateBookingTableMutation(
  options?: UseMutationOptions<BookingTableRow, Error, UpdateBookingTablePayload>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => bookingTablesApi.update(data),
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: bookingTableKeys.lists() });
      options?.onSuccess?.(...args);
    },
  });
}

export function useDeleteBookingTableMutation(
  options?: UseMutationOptions<void, Error, number>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => bookingTablesApi.deleteOne(id),
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: bookingTableKeys.lists() });
      options?.onSuccess?.(...args);
    },
  });
}
