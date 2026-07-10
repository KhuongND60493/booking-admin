"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { storesApi, storeKeys } from "@skybooking/api-client";

export function useStoreList() {
  const [brandFilter, setBrandFilter] = useState<string | null>(null);

  const {
    data: allStores = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: storeKeys.list(),
    queryFn: () => storesApi.list(),
  });

  const brands = Array.from(
    new Set(allStores.map((s) => s.conceptName).filter((name): name is string => !!name))
  );
  const stores = brandFilter ? allStores.filter((s) => s.conceptName === brandFilter) : allStores;

  return { stores, brands, brandFilter, setBrandFilter, isLoading, error };
}
