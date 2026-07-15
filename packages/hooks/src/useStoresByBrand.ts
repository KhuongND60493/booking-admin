"use client";

import { useQuery } from "@tanstack/react-query";
import { storesApi } from "@skybooking/api-client";

export function useStoresByBrand(brandIds: number[] = []) {
  const conceptId = brandIds.length === 1 ? String(brandIds[0]) : undefined;

  const { data: stores = [], error, isLoading } = useQuery({
    queryKey: ["stores", "list", conceptId ?? "all"],
    queryFn: () => storesApi.list({ conceptId }),
  });

  return { stores, isLoading, error };
}
