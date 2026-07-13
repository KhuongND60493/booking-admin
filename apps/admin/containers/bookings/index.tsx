import { PropsRemotePageDefault } from '@/containers/types'
import { RemoteProviders } from '@/containers/RemoteProviders'

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import { Button, Table } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import {
    useBookingsQuery,
    useConfirmBookingMutation,
    useCheckInBookingMutation,
    useCancelBookingMutation,
    useMarkNoShowMutation,
    useBrandOptions,
    useStoresByBrand,
    type BookingListFilters,
} from "@skybooking/hooks";
import {
    ALL_BOOKING_STATUSES,
    BookingStatus,
    bookingKeys,
    type Booking,
    type BookingQueryParams,
} from "@skybooking/api-client";
import { useTranslation } from "@/app/i18n/client";
import { usePermissions } from "@/app/auth/usePermissions";
import { PERMISSIONS } from "@/app/auth/permissions";
import { useErrorToast } from "@/app/hooks/useErrorToast";
import { computeBookingKpi } from "./utils/bookingKpi";
import {
    BookingKpiRow,
    BookingFilterBar,
    buildBookingColumns,
} from "./components";

function todayRange() {
    const today = dayjs().format("YYYY-MM-DD");
    return { dateFrom: today, dateTo: today };
}


export default function BookingListPage(props: PropsRemotePageDefault) {
    return (
        <RemoteProviders parentPage={props.parentPage}>
            <BookingListPageInner {...props} />
        </RemoteProviders>
    )
}

function BookingListPageInner({ tenantId, locale, parentPage = -1 }: PropsRemotePageDefault) {
    const { t } = useTranslation("bookings");
    const { hasPermission } = usePermissions();
    const canCreate = hasPermission(PERMISSIONS.BOOKING.CREATE);
    const canView = hasPermission(PERMISSIONS.BOOKING.VIEW);
    const canEdit = hasPermission(PERMISSIONS.BOOKING.EDIT);
    const canCancel = hasPermission(PERMISSIONS.BOOKING.CANCEL);

    const queryClient = useQueryClient();

    const { brandOptions, error: brandsError } = useBrandOptions();
    useErrorToast(brandsError);

    const [filters, setFilters] = useState<BookingListFilters>({
        brandIds: [],
        storeIds: [],
        statuses: [],
        ...todayRange(),
    });

    const { stores, getStoresByBrandIds, error: storesError } = useStoresByBrand(filters.brandIds);
    useErrorToast(storesError);

    const params: BookingQueryParams = useMemo(() => {
        const storesInScope = getStoresByBrandIds(filters.brandIds);
        const allStoreIdsInScope = storesInScope.map((s) => s.id);
        const effectiveStoreIds = filters.storeIds.length ? filters.storeIds : allStoreIdsInScope;

        const effectiveStatuses = filters.statuses.length ? filters.statuses : ALL_BOOKING_STATUSES;

        return {
            keyword: filters.keyword,
            storeIds: effectiveStoreIds,
            status: effectiveStatuses,
            startDate: dayjs(filters.dateFrom).startOf("day").format(),
            endDate: dayjs(filters.dateTo).endOf("day").format(),
        };
    }, [filters, getStoresByBrandIds]);

    const { data, isLoading, isFetching } = useBookingsQuery(params);
    const bookings = data?.records ?? [];

    const invalidateList = useCallback(
        () => queryClient.invalidateQueries({ queryKey: bookingKeys.lists() }),
        [queryClient]
    );

    const confirmMutation = useConfirmBookingMutation({ onSuccess: invalidateList });
    const checkInMutation = useCheckInBookingMutation({ onSuccess: invalidateList });
    const cancelMutation = useCancelBookingMutation({ onSuccess: invalidateList });
    const noShowMutation = useMarkNoShowMutation({ onSuccess: invalidateList });

    const setKeyword = (keyword: string) => setFilters((f) => ({ ...f, keyword }));
    const setPeriod = (dateFrom: string, dateTo: string) =>
        setFilters((f) => ({ ...f, dateFrom, dateTo }));
    const setBrandIds = (brandIds: number[]) => setFilters((f) => ({ ...f, brandIds }));
    const setStoreIds = (storeIds: number[]) => setFilters((f) => ({ ...f, storeIds }));
    const setStatuses = (statuses: BookingStatus[]) => setFilters((f) => ({ ...f, statuses }));

    const confirmBooking = async (id: number) => {
        await confirmMutation.mutateAsync(id);
    };
    const checkInBooking = async (id: number) => {
        await checkInMutation.mutateAsync(id);
    };
    const cancelBooking = async (id: number) => {
        await cancelMutation.mutateAsync({ id });
    };
    const noShowBooking = async (id: number) => {
        await noShowMutation.mutateAsync(id);
    };

    const handleBrandIdsChange = (nextBrandIds: number[]) => {
        if (nextBrandIds.length === 0) {
            setBrandIds([]);
            return;
        }
        const removedBrandIds = filters.brandIds.filter((id) => !nextBrandIds.includes(id));
        const nextStoreIds = removedBrandIds.length
            ? filters.storeIds.filter((storeId) => {
                const store = stores.find((s) => s.id === storeId);
                return store?.conceptId != null ? !removedBrandIds.includes(store.conceptId) : true;
            })
            : filters.storeIds;
        setBrandIds(nextBrandIds);
        if (nextStoreIds.length !== filters.storeIds.length) setStoreIds(nextStoreIds);
    };

    const storeNameMap = useMemo(
        () => Object.fromEntries(stores.map((s) => [s.id, s.name])),
        [stores]
    );

    const storeOptions = useMemo(
        () => getStoresByBrandIds(filters.brandIds).map((s) => ({ value: s.id, label: s.name })),
        [stores, filters.brandIds, getStoresByBrandIds]
    );

    const kpi = useMemo(() => computeBookingKpi(bookings), [bookings]);

    const columns = useMemo(
        () =>
            buildBookingColumns({
                t,
                storeNameMap,
                onConfirm: confirmBooking,
                onCheckIn: checkInBooking,
                onCancel: cancelBooking,
                onNoShow: noShowBooking,
                canView,
                canEdit,
                canCancel,
            }),
        [
            t,
            storeNameMap,
            confirmBooking,
            checkInBooking,
            cancelBooking,
            noShowBooking,
            canView,
            canEdit,
            canCancel,
        ]
    );

    return (
        <div className="p-4">
            <div className="flex items-start justify-between mb-8">
                <h1 className="font-heading text-xl font-bold text-admin-ink">
                    {t("title")}- TEST ROMIO
                </h1>
                {canCreate && (
                    <Link href="/bookings/new">
                        <Button type="primary">{t("createNew")}</Button>
                    </Link>
                )}
            </div>
            <BookingFilterBar
                filters={filters}
                brandOptions={brandOptions}
                storeOptions={storeOptions}
                onKeywordChange={setKeyword}
                onPeriodChange={setPeriod}
                onBrandIdsChange={handleBrandIdsChange}
                onStoreIdsChange={setStoreIds}
                onStatusesChange={setStatuses}
                t={t}
            />
            <BookingKpiRow kpi={kpi} t={t} />
            <Table<Booking>
                rowKey="id"
                columns={columns}
                dataSource={bookings}
                loading={isLoading || isFetching}
                bordered
                scroll={{ x: 1280 }}
                pagination={{ pageSize: 20, showSizeChanger: false }}
                locale={{ emptyText: t("empty") }}
            />
        </div>
    );
}
