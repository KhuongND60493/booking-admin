"use client";

import { createContext, useContext } from "react";
import { useStoreList } from "./useStoreList";

// Context CẤP TRANG (khác BookingContext toàn cục) — cho trang Home, nơi
// nhiều component con (BrandFilterBar1, StoreList1) cần dùng chung 1 instance
// state của useStoreList() thay vì mỗi component tự gọi hook riêng (sẽ tạo
// 2 state không đồng bộ: chọn filter ở 1 component không ảnh hưởng component kia).
type StoreListContextValue = ReturnType<typeof useStoreList>;

const StoreListContext = createContext<StoreListContextValue | null>(null);

export function StoreListProvider({ children }: { children: React.ReactNode }) {
  const value = useStoreList();
  return <StoreListContext.Provider value={value}>{children}</StoreListContext.Provider>;
}

export function useStoreListContext() {
  const ctx = useContext(StoreListContext);
  if (!ctx) throw new Error("useStoreListContext must be used within StoreListProvider");
  return ctx;
}
