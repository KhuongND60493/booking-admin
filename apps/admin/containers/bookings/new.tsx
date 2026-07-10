"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { App, Button } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import {
    buildCreateBookingPayload,
    useBookingForm,
    useBrandOptions,
    useCreateBookingMutation,
    useStoresByBrand,
} from "@skybooking/hooks";
import { bookingKeys, BookingSource } from "@skybooking/api-client";
import { useTranslation } from "@/app/i18n/client";
import {
    BookingFormLayout,
    BookingDetailsSection,
    CustomerInfoSection,
    BookingSummaryPanel,
} from "./components";
import { bookingErrorMessage } from "./utils/bookingErrorMessage";

export default function CreateBookingPage() {
    const { t } = useTranslation("bookings");
    const { message, modal } = App.useApp();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { brandOptions, error: brandsError } = useBrandOptions();
    const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
    const { stores, error: storesError } = useStoresByBrand(
        selectedBrandId ? [selectedBrandId] : []
    );

    const createMutation = useCreateBookingMutation({
        onSuccess: () => queryClient.invalidateQueries({ queryKey: bookingKeys.lists() }),
    });

    const form = useBookingForm(stores, null, (data) =>
        createMutation.mutateAsync(buildCreateBookingPayload(data, BookingSource.Staff))
    );

    const handleBrandIdChange = (brandId: number | null) => {
        setSelectedBrandId(brandId);
        form.setBrandId(brandId);
    };

    useEffect(() => {
        const err = brandsError ?? storesError;
        if (err) message.error(err.message || "Không tải được dữ liệu.");
    }, [brandsError, storesError, message]);

    useEffect(() => {
        form.loadTables();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.state.date, form.state.time, form.state.partySize]);

    const storeOptions = useMemo(
        () => stores.map((s) => ({ value: String(s.id), label: s.name })),
        [stores]
    );

    const selectedStore = stores.find((s) => String(s.id) === form.state.storeId);
    const selectedTables = form.tables.filter((tbl) => form.state.selectedTableIds.includes(tbl.id));

    const handleSave = async () => {
        try {
            await form.submit();
            message.success(t("toast.createSuccess"));
            router.push("/bookings");
        } catch (err) {
            message.error(t("toast.createError", { error: bookingErrorMessage(err, t) }));
        }
    };

    const handleCancel = () => {
        if (!form.isDirty) {
            router.push("/bookings");
            return;
        }
        modal.confirm({
            title: t("detail.confirmExitTitle"),
            content: t("detail.confirmExitContent"),
            okText: t("detail.exit"),
            cancelText: t("detail.stay"),
            onOk: () => router.push("/bookings"),
        });
    };

    return (
        <BookingFormLayout
            title={t("new.title")}
            subtitle={t("new.subtitle")}
            actions={
                <>
                    <Button onClick={handleCancel}>{t("detail.cancel")}</Button>
                    <Button type="primary" onClick={handleSave} disabled={!form.isValid}>
                        {t("detail.save")}
                    </Button>
                </>
            }
            summary={
                <BookingSummaryPanel
                    t={t}
                    storeLabel={selectedStore?.name}
                    date={form.state.date}
                    time={form.state.time}
                    partySize={form.state.partySize}
                    selectedTables={selectedTables}
                    totalCapacity={form.totalCapacity}
                    customerName={form.state.customer.name}
                    customerPhone={form.state.customer.phone}
                    customerEmail={form.state.customer.email}
                    note={form.state.customer.note}
                />
            }
        >
            <BookingDetailsSection
                t={t}
                brandOptions={brandOptions}
                brandId={form.state.brandId}
                onBrandIdChange={handleBrandIdChange}
                storeOptions={storeOptions}
                storeId={form.state.storeId}
                onStoreIdChange={form.setStoreId}
                date={form.state.date}
                onDateChange={form.setDate}
                timeSlots={form.timeSlots}
                time={form.state.time}
                onTimeChange={form.setTime}
                partySize={form.state.partySize}
                onPartySizeChange={form.setPartySize}
                zones={form.zones}
                zone={form.state.zone}
                onZoneChange={form.setZone}
                tables={form.visibleTables}
                selectedTableIds={form.state.selectedTableIds}
                onToggleTable={form.toggleTable}
            />
            <CustomerInfoSection
                t={t}
                name={form.state.customer.name}
                onNameChange={(name) => form.setCustomer({ name })}
                phone={form.state.customer.phone}
                onPhoneChange={(phone) => form.setCustomer({ phone })}
                phoneError={form.phoneError}
                email={form.state.customer.email}
                onEmailChange={(email) => form.setCustomer({ email })}
                emailError={form.emailError}
                note={form.state.customer.note}
                onNoteChange={(note) => form.setCustomer({ note })}
            />
        </BookingFormLayout>
    );
}
