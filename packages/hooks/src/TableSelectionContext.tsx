"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useTableSelection } from "./useTableSelection";
import { readBookingDraft } from "./bookingDraft";

// Context CẤP TRANG cho Table Selection — ZoneTabs1/TableGridBody1/
// TableSelectionSummary1 đều cần dùng chung 1 instance state (zone đang chọn,
// danh sách bàn đã toggle, tổng capacity) — không được mỗi component tự gọi
// useTableSelection() riêng (sẽ không đồng bộ giữa các khối).
type TableSelectionContextValue = ReturnType<typeof useTableSelection>;

const TableSelectionContext = createContext<TableSelectionContextValue | null>(null);

export function TableSelectionProvider({ children }: { children: React.ReactNode }) {
  const [partySize, setPartySize] = useState(2);
  useEffect(() => {
    setPartySize(readBookingDraft().partySize ?? 2);
  }, []);

  const value = useTableSelection(partySize);
  return <TableSelectionContext.Provider value={value}>{children}</TableSelectionContext.Provider>;
}

export function useTableSelectionContext() {
  const ctx = useContext(TableSelectionContext);
  if (!ctx) throw new Error("useTableSelectionContext must be used within TableSelectionProvider");
  return ctx;
}
