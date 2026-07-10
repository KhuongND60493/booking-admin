"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { tablesApi, tableKeys, ZONES } from "@skybooking/api-client";
import { writeBookingDraft } from "./bookingDraft";

export function useTableSelection(partySize: number) {
  const [activeZone, setActiveZone] = useState(ZONES[0]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const {
    data: tables = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: tableKeys.search({}),
    queryFn: () => tablesApi.search({}),
  });

  const zoneTables = tables.filter((t) => t.zone === activeZone);

  const toggleTable = (id: string) => {
    setSelectedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      writeBookingDraft({ tableIds: next });
      return next;
    });
  };

  const selectedTables = tables.filter((t) => selectedIds.includes(t.id));
  const totalCapacity = selectedTables.reduce((sum, t) => sum + t.capacity, 0);
  const hasMultiZoneWarning = new Set(selectedTables.map((t) => t.zone)).size > 1;
  const isEnoughCapacity = totalCapacity >= partySize;

  return {
    zones: ZONES,
    activeZone,
    setActiveZone,
    zoneTables,
    isLoading,
    error,
    selectedIds,
    selectedTables,
    toggleTable,
    totalCapacity,
    selectedTablesCount: selectedIds.length,
    hasMultiZoneWarning,
    isEnoughCapacity,
  };
}
