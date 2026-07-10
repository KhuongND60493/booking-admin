"use client";
import { BrandFilterBarProps } from "../types";
import { useStoreListContext } from "@skybooking/hooks";

// Biến thể 1: chip lọc theo thương hiệu — dùng chung state với StoreList1 qua StoreListProvider.
export function BrandFilterBar1(_props: BrandFilterBarProps) {
  const { brands, brandFilter, setBrandFilter } = useStoreListContext();

  return (
    <div className="max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto px-4 py-4 font-body">
      <div className="flex gap-2 overflow-x-auto md:flex-wrap md:overflow-visible pb-2">
        <button
          onClick={() => setBrandFilter(null)}
          className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium border ${
            brandFilter === null ? "bg-primary text-white border-primary" : "border-gray-300 text-ink-muted"
          }`}
        >
          Tất cả
        </button>
        {brands.map((b) => (
          <button
            key={b}
            onClick={() => setBrandFilter(b)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium border ${
              brandFilter === b ? "bg-primary text-white border-primary" : "border-gray-300 text-ink-muted"
            }`}
          >
            {b}
          </button>
        ))}
      </div>
    </div>
  );
}
