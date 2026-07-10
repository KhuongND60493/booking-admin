"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { storesApi } from "@skybooking/api-client";

export function useStoresByBrand(brandIds: number[] = []) {
  const { data: allStores = [], error, isLoading } = useQuery({
    queryKey: ["stores", "list"],
    queryFn: () => storesApi.list(),
  });

  const stores = useMemo(
    () =>
      brandIds.length === 0
        ? allStores
        : allStores.filter((s) => s.conceptId != null && brandIds.includes(s.conceptId)),
    [allStores, brandIds]
  );

  const getStoresByBrandIds = (ids: number[]) =>
    ids.length === 0
      ? allStores
      : allStores.filter((s) => s.conceptId != null && ids.includes(s.conceptId));

  return { stores, allStores, getStoresByBrandIds, isLoading, error };
}
