"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Puck } from "@measured/puck";
import "@measured/puck/puck.css";
import { getConfigForPage, toPuckData } from "@skybooking/puck-config";
import {
  pageConfigApi,
  pageConfigKeys,
  type PageKey,
  type PageConfigComponent,
  type PageConfigData,
} from "@skybooking/api-client";
import { BookingContextProvider, StoreListProvider, TableSelectionProvider } from "@skybooking/hooks";
import { PAGE_LABELS } from "../pageLabels";

const DEMO_TENANT = "demo-tenant";
const DEMO_STORE_ID = "cuu-van-long-q1";

export default function EditLayoutPageClient({ params }: { params: Promise<{ page: PageKey }> }) {
  const { page } = use(params);
  const config = getConfigForPage(page);
  const queryClient = useQueryClient();

  const { data: pageConfig, isError } = useQuery({
    queryKey: pageConfigKeys.detail(DEMO_STORE_ID, page),
    queryFn: () => pageConfigApi.fetchConfig(DEMO_STORE_ID, page),
    retry: false,
  });

  const [data, setData] = useState<ReturnType<typeof toPuckData> | null>(null);

  useEffect(() => {
    if (pageConfig !== undefined) setData(toPuckData(page, pageConfig));
    else if (isError) setData(toPuckData(page, null));
  }, [page, pageConfig, isError]);

  const publishMutation = useMutation({
    mutationFn: (payload: PageConfigData) => pageConfigApi.saveConfig(DEMO_STORE_ID, page, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pageConfigKeys.detail(DEMO_STORE_ID, page) });
    },
    meta: {
      successMessageKey: "toast.success.saveLayout",
      successMessageOptions: { page },
      errorMessageKey: "toast.error.saveLayout",
    },
  });

  if (!data) return <div className="p-8 text-sm text-gray-500">Đang tải cấu hình...</div>;

  const puckEditor = (
    <Puck
      config={config}
      data={data as any}
      onPublish={(newData) => {
        const components: PageConfigComponent[] = newData.content.map((c: any) => ({
          type: c.type,
          props: c.props,
        }));
        publishMutation.mutate({ storeId: DEMO_STORE_ID, page, components });
      }}
    />
  );

  // Component con của Home/Table Selection cần context cấp trang (BrandFilterBar1/
  // StoreList1 dùng chung useStoreListContext(); ZoneTabs1/TableGridBody1/
  // TableSelectionSummary1 dùng chung useTableSelectionContext()) — preview trong
  // admin cũng phải bọc đúng Provider, nếu không sẽ throw lúc render.
  let content = puckEditor;
  if (page === "home") {
    content = <StoreListProvider>{content}</StoreListProvider>;
  } else if (page === "tableSelection") {
    content = <TableSelectionProvider>{content}</TableSelectionProvider>;
  }

  return (
    <div>
      <div className="px-6 py-3 border-b border-gray-200 bg-white text-xs">
        <Link href="/edit-layout" className="text-gray-500 hover:text-amber-600">
          Chỉnh sửa layout trang booking
        </Link>
        <span className="mx-1.5 text-gray-300">/</span>
        <span className="font-semibold text-gray-900">{PAGE_LABELS[page]}</span>
      </div>
      <BookingContextProvider value={{ tenant: DEMO_TENANT, storeId: DEMO_STORE_ID }}>
        {content}
      </BookingContextProvider>
    </div>
  );
}
