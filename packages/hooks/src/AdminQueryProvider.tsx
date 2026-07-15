"use client";

import type { MessageInstance } from "antd/es/message/interface";
import type { TFunction } from "i18next";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  getAdminQueryClient,
  setAdminQueryClientMessage,
  setAdminQueryClientTranslator,
} from "./adminQueryClient";

export function AdminQueryProvider({
  children,
  t,
  messageApi,
}: {
  children: React.ReactNode;
  t: TFunction;
  messageApi: MessageInstance;
}) {
  const queryClient = getAdminQueryClient();
  setAdminQueryClientTranslator(t);
  setAdminQueryClientMessage(messageApi);
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
