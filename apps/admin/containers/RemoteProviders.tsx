"use client";

import type { ReactNode } from "react";
import { App } from "antd";
import { AdminQueryProvider } from "@skybooking/hooks/admin";

interface Props {
  parentPage?: number;
  children: ReactNode;
}
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
