"use client";

import type {ReactNode} from "react";
import {App} from "antd";
import {AdminQueryProvider} from "@skybooking/hooks/admin";
import {useTranslation} from "@/app/i18n/client";

interface Props {
    parentPage?: number;
    children: ReactNode;
}

export function RemoteProviders({parentPage = -1, children}: Props) {
  const { t } = useTranslation("common");
  const { message: messageApi } = App.useApp();
    if (parentPage === -1) {
        return <>{children}</>;
    }

    return (
        <AdminQueryProvider t={t} messageApi={messageApi}>
            <App>{children}</App>
        </AdminQueryProvider>
    );
}
