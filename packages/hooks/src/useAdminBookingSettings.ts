"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import {
  bookingSettingsApi,
  bookingSettingKeys,
  DEFAULT_ORGANIZATION_ID,
  type BookingSetting,
} from "@skybooking/api-client";

export function useBookingSettingQuery(storeId: number) {
  return useQuery({
    queryKey: bookingSettingKeys.detail(storeId),
    queryFn: () => bookingSettingsApi.getSetting({ orgId: DEFAULT_ORGANIZATION_ID, storeId }),
    placeholderData: keepPreviousData,
  });
}

export function useUpdateBookingSettingMutation(
  options?: UseMutationOptions<BookingSetting, Error, { storeId: number; data: BookingSetting }>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ storeId, data }) =>
      bookingSettingsApi.update({ orgId: DEFAULT_ORGANIZATION_ID, storeId }, data),
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: bookingSettingKeys.all });
      options?.onSuccess?.(...args);
    },
  });
}
