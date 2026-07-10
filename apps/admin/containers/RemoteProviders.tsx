"use client";

import type { ReactNode } from "react";
import { App } from "antd";
import { AdminQueryProvider } from "@skybooking/hooks/admin";

interface Props {
  parentPage?: number;
  children: ReactNode;
}

// Mọi component expose qua Module Federation (containers/*) đều nhận prop `parentPage`.
// parentPage === -1 (mặc định, không truyền) => đang chạy standalone trong booking-admin,
// đã có sẵn AdminQueryProvider/antd <App> từ app/layout.tsx — bọc lại là dư thừa.
// parentPage khác -1 => bị resto gọi qua Module Federation, mount thẳng vào cây React của
// resto, KHÔNG đi qua app/layout.tsx — phải tự bọc provider ở đây thì mới đủ context.
export function RemoteProviders({ parentPage = -1, children }: Props) {
  if (parentPage === -1) {
    return <>{children}</>;
  }

  return (
    <AdminQueryProvider>
      <App>{children}</App>
    </AdminQueryProvider>
  );
}
