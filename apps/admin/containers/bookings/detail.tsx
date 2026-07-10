"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { App, Button } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import { bookingKeys } from "@skybooking/api-client";
import {
    useBookingForm,
    useBookingQuery,
    useBrandOptions,
    useStoresByBrand,
    useUpdateBookingBasicInfoMutation,
} from "@skybooking/hooks";
import { useTranslation } from "@/app/i18n/client";
import { usePermissions } from "@/app/auth/usePermissions";
import { PERMISSIONS } from "@/app/auth/permissions";
import {
    BookingFormLayout,
    BookingDetailsSection,
    CustomerInfoSection,
    BookingSummaryPanel,
} from "./components";
import { bookingErrorMessage } from "./utils/bookingErrorMessage";

export default function BookingDetailPage({ id }: { id:number}) {

    const { t } = useTranslation("bookings");
    const { message, modal } = App.useApp();
    const router = useRouter();
    const { hasPermission } = usePermissions();
    const canEdit = hasPermission(PERMISSIONS.BOOKING.EDIT);
    const canView = hasPermission(PERMISSIONS.BOOKING.VIEW);

    const queryClient = useQueryClient();
    const { data: booking, isLoading, isError } = useBookingQuery(id);
    const { brandOptions, error: brandsError } = useBrandOptions();
    const { stores, error: storesError } = useStoresByBrand();

    useEffect(() => {
        const err = brandsError ?? storesError;
        if (err) message.error(err.message || "Không tải được dữ liệu.");
    }, [brandsError, storesError, message]);

    const updateMutation = useUpdateBookingBasicInfoMutation({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
            queryClient.invalidateQueries({ queryKey: bookingKeys.detail(id) });
        },
    });

    const form = useBookingForm(stores, booking ?? null, async (data) => {
        const startTime = `${data.date}T${data.time}:00`;
        return updateMutation.mutateAsync({
            id,
            patch: {
                customerName: data.customer.name,
                customerPhone: data.customer.phone,
                customerEmail: data.customer.email,
                startTime,
                note: data.customer.note,
            },
        });
    });

    useEffect(() => {
        if (booking && !canView && !canEdit) {
            router.push("/bookings");
        }
    }, [booking, canView, canEdit, router]);

    const storeOptions = useMemo(
        () =>
            stores
                .filter((s) => !form.state.brandId || s.conceptId === form.state.brandId)
                .map((s) => ({ value: String(s.id), label: s.name })),
        [stores, form.state.brandId]
    );

    if (isLoading) {
        return <div className="p-6 text-xs text-admin-muted">{t("detail.loading")}</div>;
    }

    if (isError || !booking) {
        return (
            <div className="p-6">
                <p className="text-sm text-admin-ink mb-4">{t("detail.notFound")}</p>
                <Button onClick={() => router.push("/bookings")}>{t("detail.back")}</Button>
            </div>
        );
    }

    if (!canView && !canEdit) {
        return null;
    }

    const isReadOnly = !canEdit;
    const selectedStore = stores.find((s) => String(s.id) === form.state.storeId);
    const selectedTables = booking.assignedTables ?? [];
    const tableCapacity = (tbl: (typeof selectedTables)[number]) => tbl.capacity ?? tbl.maxCapacity ?? 0;
    const totalCapacity = selectedTables.reduce((sum, tbl) => sum + tableCapacity(tbl), 0);

    const handleSave = async () => {
        try {
            await form.submit();
            message.success(t("toast.updateSuccess"));
            router.push("/bookings");
        } catch (err) {
            message.error(t("toast.updateError", { error: bookingErrorMessage(err, t) }));
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
            title={isReadOnly ? t("detail.viewTitle") : t("detail.editTitle")}
            actions={
                isReadOnly ? (
                    <Button onClick={() => router.push("/bookings")}>{t("detail.back")}</Button>
                ) : (
                    <>
                        <Button onClick={handleCancel}>{t("detail.cancel")}</Button>
                        <Button type="primary" onClick={handleSave} disabled={!form.isValid}>
                            {t("detail.save")}
                        </Button>
                    </>
                )
            }
            summary={
                <BookingSummaryPanel
                    t={t}
                    storeLabel={selectedStore?.name}
                    date={form.state.date}
                    time={form.state.time}
                    partySize={form.state.partySize}
                    selectedTables={selectedTables.map((tbl) => ({
                        id: String(tbl.id),
                        name: tbl.tableCode,
                        capacity: tableCapacity(tbl),
                        available: true,
                        location: "",
                        zone: "",
                    }))}
                    totalCapacity={totalCapacity}
                    customerName={form.state.customer.name}
                    customerPhone={form.state.customer.phone}
                    customerEmail={form.state.customer.email}
                    note={form.state.customer.note}
                    bookingCode={booking.bookingCode}
                    createdAt={dayjs(booking.createdDate).format("DD/MM/YYYY HH:mm")}
                />
            }
        >
            <BookingDetailsSection
                t={t}
                readOnly
                brandOptions={brandOptions}
                brandId={form.state.brandId}
                onBrandIdChange={form.setBrandId}
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
                readOnly={isReadOnly}
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
