"use client";
import { StoreListProps } from "../types";
import { useStoreListContext, useBookingContext } from "@skybooking/hooks";
import { useRouter } from "next/navigation";

// Biến thể 1: danh sách card nhà hàng — dùng chung state với BrandFilterBar1 qua StoreListProvider.
// Responsive: 1 cột mobile, 2 cột md:, 3 cột lg:.
export function StoreList1(_props: StoreListProps) {
  const { stores, isLoading, error } = useStoreListContext();
  const { tenant } = useBookingContext();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto px-4">
        <p className="text-ink-muted text-sm">Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto px-4">
        <p className="text-xs text-red-600">Không tải được danh sách nhà hàng. Vui lòng thử lại sau.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto px-4 pb-8 font-body">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stores.map((store) => (
          <div key={store.id} className="bg-white rounded-2xl overflow-hidden border border-gray-200">
            <div className="h-32 bg-gray-100 relative flex items-center justify-center">
              <span className="text-xs text-gray-400 font-mono">[ ảnh nhà hàng ]</span>
              {store.conceptName && (
                <span className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {store.conceptName}
                </span>
              )}
            </div>
            <div className="p-4">
              <div className="font-semibold text-ink">{store.name}</div>
              <div className="text-xs text-ink-muted mb-3">{store.address}</div>
              <button
                onClick={() => router.push(`/${tenant}/${store.id}`)}
                className="w-full bg-primary text-white py-2.5 rounded-xl font-semibold text-sm"
              >
                Đặt bàn ngay
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
