"use client";

import { App } from "antd";
import { AdminQueryProvider } from "@skybooking/hooks/admin";
import { useTranslation } from "../i18n/client";

export function AdminQueryProviderWithI18n({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation("common");
  const { message: messageApi } = App.useApp();
  return (
    <AdminQueryProvider t={t} messageApi={messageApi}>
      {children}
    </AdminQueryProvider>
  );
}
