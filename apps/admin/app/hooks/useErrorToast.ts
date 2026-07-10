"use client";

import { useEffect } from "react";
import { App } from "antd";

// Hiện toast lỗi khi 1 lỗi gọi API (404/500/502...) xảy ra — KHÔNG phải lỗi
// code/runtime, nên không dùng Error Boundary. Mỗi component tự truyền error
// state từ hook fetch (useStoreOptions, useAdminWaitlist...) vào đây.
export function useErrorToast(error: Error | null) {
  const { message } = App.useApp();

  useEffect(() => {
    if (error) message.error(error.message || "Không tải được dữ liệu, vui lòng thử lại.");
  }, [error, message]);
}
