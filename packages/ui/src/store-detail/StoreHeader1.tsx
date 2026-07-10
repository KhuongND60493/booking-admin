"use client";
import { StoreHeaderProps } from "../types";
import { useStoreDetail } from "@skybooking/hooks";

// Biến thể 1: ảnh + tên + địa chỉ nhà hàng.
// Responsive: xếp chồng ở mobile, ảnh bên trái + text bên phải ở desktop.
export function StoreHeader1(_props: StoreHeaderProps) {
  const { store, error } = useStoreDetail();

  if (error) {
    return (
      <div className="max-w-lg md:max-w-3xl mx-auto px-4 pt-6 font-body">
        <p className="text-xs text-red-600">
          Không tải được thông tin nhà hàng. Vui lòng thử lại sau.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-lg md:max-w-3xl mx-auto px-4 pt-6 font-body">
      <div className="md:flex md:gap-6 md:items-center">
        <div className="h-40 md:h-32 md:w-48 md:flex-shrink-0 bg-gray-100 rounded-2xl mb-4 md:mb-0 flex items-center justify-center">
          <span className="text-xs text-gray-400 font-mono">[ ảnh {store?.name ?? ""} ]</span>
        </div>
        <div>
          <div className="font-heading text-xl font-medium text-ink">{store?.name}</div>
          <div className="text-xs text-ink-muted">{store?.address}</div>
        </div>
      </div>
    </div>
  );
}
