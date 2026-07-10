"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { brandsApi } from "@skybooking/api-client";

export function useBrandOptions() {
  const { data: brands = [], error, isLoading } = useQuery({
    queryKey: ["brands", "list"],
    queryFn: () => brandsApi.list(),
  });

  const brandOptions = useMemo(
    () => brands.map((b) => ({ value: b.id, label: b.name })),
    [brands]
  );

  return { brands, brandOptions, isLoading, error };
}
