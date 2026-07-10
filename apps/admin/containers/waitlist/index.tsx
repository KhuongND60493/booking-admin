"use client";

import { useState } from "react";
import { Table, Button, Modal } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useAdminWaitlist } from "@skybooking/hooks";
import { AdminQueryProvider } from "@skybooking/hooks/admin";
import type { WaitlistEntry } from "@skybooking/api-client";
import { useTranslation } from "@/app/i18n/client";
import { useErrorToast } from "@/app/hooks/useErrorToast";
import {PropsRemotePageDefault} from "@/containers/types";

const DEMO_STORE_ID = "cuu-van-long-q1";

// Khi expose qua Module Federation, resto mount thẳng component này vào cây React của
// nó — không đi qua app/layout.tsx của booking-admin, nên AdminQueryProvider (đang bọc
// toàn app lúc chạy standalone) không có sẵn. Bọc riêng ở đây để component tự đủ
// QueryClient dù chạy trong cây nào. QueryClientProvider lồng nhau là an toàn (không lỗi)
// nên không ảnh hưởng khi chạy standalone (đã có AdminQueryProvider ở app/layout.tsx).
export default function WaitlistPage(props: PropsRemotePageDefault) {
    return (
        <AdminQueryProvider>
            <WaitlistPageInner {...props} />
        </AdminQueryProvider>
    );
}

function WaitlistPageInner({ tenantId, locale, parentPage = -1 }: PropsRemotePageDefault) {
    const { t } = useTranslation("waitlist");
    const { entries, isLoading, error, convertingId, openConvert, dismissConvert, confirmConvert } =
        useAdminWaitlist(DEMO_STORE_ID);
    useErrorToast(error);
    const [isConverting, setIsConverting] = useState(false);

    const entry = entries.find((e) => e.id === convertingId);

    const handleConfirm = async () => {
        setIsConverting(true);
        await confirmConvert([]);
        setIsConverting(false);
    };

    const columns: ColumnsType<WaitlistEntry> = [
        {
            title: t("column.id"),
            dataIndex: "id",
            key: "id",
            width: 90,
            render: (id: string) => <span className="font-mono text-admin-muted-soft text-xs">{id}</span>,
        },
        {
            title: t("column.customer"),
            key: "customer",
            render: (_, w) => <span className="font-medium text-admin-ink">{w.customer.name}</span>,
        },
        { title: t("column.phone"), key: "phone", render: (_, w) => w.customer.phone },
        {
            title: t("column.preferredTime"),
            dataIndex: "preferredTime",
            key: "preferredTime",
            render: (time: string) => <span className="font-semibold text-admin-ink">{time}</span>,
        },
        {
            title: t("column.partySize"),
            dataIndex: "partySize",
            key: "partySize",
            render: (p: number) => <span className="font-semibold text-admin-ink">{p}</span>,
        },
        {
            title: t("column.actions"),
            key: "actions",
            render: (_, w) => (
                <Button size="small" onClick={() => openConvert(w.id)}>
                    {t("convert")}
                </Button>
            ),
        },
    ];

    return (
        <div className="p-8">
            <h1 className="font-heading text-xl font-bold text-admin-ink mb-1">{t("title")}</h1>
            <p className="text-xs text-admin-muted mb-6">{t("waitingCount", { count: entries.length })}</p>

            <Table<WaitlistEntry>
                rowKey="id"
                columns={columns}
                dataSource={entries}
                loading={isLoading}
                pagination={{ pageSize: 10, hideOnSinglePage: true }}
                locale={{ emptyText: t("empty") }}
            />

            <Modal
                open={!!entry}
                onCancel={dismissConvert}
                title={t("convertModal.title")}
                okText={t("convertModal.ok")}
                cancelText={t("convertModal.cancel")}
                confirmLoading={isConverting}
                onOk={handleConfirm}
            >
                {entry && (
                    <>
                        <p className="text-xs text-admin-muted mb-4">{t("convertModal.desc")}</p>
                        <div className="bg-admin-bg rounded-lg p-3.5 space-y-1.5 text-xs">
                            <div className="flex justify-between">
                                <span className="text-admin-muted">{t("convertModal.customer")}</span>
                                <span className="font-medium text-admin-ink">{entry.customer.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-admin-muted">{t("convertModal.phone")}</span>
                                <span className="text-admin-ink">{entry.customer.phone}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-admin-muted">{t("convertModal.partySize")}</span>
                                <span className="text-admin-ink">{t("convertModal.people", { count: entry.partySize })}</span>
                            </div>
                        </div>
                    </>
                )}
            </Modal>
        </div>
    );
}
