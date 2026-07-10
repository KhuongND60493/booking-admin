"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { waitlistApi, waitlistKeys } from "@skybooking/api-client";

export function useAdminWaitlist(storeId: string) {
  const queryClient = useQueryClient();
  const [convertingId, setConvertingId] = useState<string | null>(null);

  const {
    data: allEntries = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: waitlistKeys.list(storeId),
    queryFn: () => waitlistApi.listByStore(storeId),
  });
  const entries = allEntries.filter((e) => !e.converted);

  const convertMutation = useMutation({
    mutationFn: ({ id, tableIds }: { id: string; tableIds: string[] }) =>
      waitlistApi.convert(id, tableIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: waitlistKeys.list(storeId) });
    },
  });

  const openConvert = (id: string) => setConvertingId(id);
  const dismissConvert = () => setConvertingId(null);

  const confirmConvert = async (tableIds: string[]) => {
    if (!convertingId) return null;
    const booking = await convertMutation.mutateAsync({ id: convertingId, tableIds });
    setConvertingId(null);
    return booking;
  };

  return { entries, isLoading, error, convertingId, openConvert, dismissConvert, confirmConvert };
}
