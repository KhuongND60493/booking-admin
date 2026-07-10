"use client";

import {
  useMutation,
  useQuery,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import {
  bookingsApi,
  bookingKeys,
  BookingStatus,
  type Booking,
  type BookingListResult,
  type BookingQueryParams,
  type CreateBookingPayload,
  type UpdateBookingBasicInfoPayload,
} from "@skybooking/api-client";

export function useBookingsQuery(
  params: BookingQueryParams,
  options?: Partial<UseQueryOptions<BookingListResult>>
) {
  return useQuery({
    queryKey: bookingKeys.list(params),
    queryFn: () => bookingsApi.list(params),
    ...options,
  });
}

export function useBookingQuery(
  id: number | null,
  options?: Partial<UseQueryOptions<Booking>>
) {
  return useQuery({
    queryKey: bookingKeys.detail(id ?? 0),
    queryFn: () => bookingsApi.getOne(id!),
    enabled: !!id,
    staleTime: 0,
    ...options,
  });
}

export function useCreateBookingMutation(
  options?: UseMutationOptions<Booking, Error, CreateBookingPayload>
) {
  return useMutation({
    mutationFn: (data) => bookingsApi.create(data),
    ...options,
  });
}

export function useUpdateBookingBasicInfoMutation(
  options?: UseMutationOptions<Booking, Error, { id: number; patch: UpdateBookingBasicInfoPayload }>
) {
  return useMutation({
    mutationFn: ({ id, patch }) => bookingsApi.updateBasicInfo(id, patch),
    ...options,
  });
}

export function useConfirmBookingMutation(
  options?: UseMutationOptions<Booking, Error, number>
) {
  return useMutation({
    mutationFn: (id) => bookingsApi.confirm(id),
    ...options,
  });
}

export function useCheckInBookingMutation(
  options?: UseMutationOptions<Booking, Error, number>
) {
  return useMutation({
    mutationFn: (id) => bookingsApi.checkIn(id),
    ...options,
  });
}

export function useAssignTableMutation(
  options?: UseMutationOptions<Booking, Error, { id: number; tableIds: number[] }>
) {
  return useMutation({
    mutationFn: ({ id, tableIds }) => bookingsApi.assignTable(id, tableIds),
    ...options,
  });
}

export function useCancelBookingMutation(
  options?: UseMutationOptions<Booking, Error, { id: number; cancelReason?: string }>
) {
  return useMutation({
    mutationFn: ({ id, cancelReason }) => bookingsApi.cancel(id, cancelReason),
    ...options,
  });
}

export function useMarkNoShowMutation(
  options?: UseMutationOptions<Booking, Error, number>
) {
  return useMutation({
    mutationFn: (id) => bookingsApi.markNoShow(id),
    ...options,
  });
}

export function useChangeBookingStatusMutation(
  options?: UseMutationOptions<Booking, Error, { id: number; status: BookingStatus; note?: string }>
) {
  return useMutation({
    mutationFn: ({ id, status, note }) => bookingsApi.changeStatus(id, status, note),
    ...options,
  });
}
