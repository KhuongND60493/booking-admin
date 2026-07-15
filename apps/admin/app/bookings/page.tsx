"use client";

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
  useStoresByBrand,
  type BookingListFilters,
} from "@skybooking/hooks";
import { PageActionContainer, PageActionGroup } from "@skybooking/ui";
import {
  ALL_BOOKING_STATUSES,
  BookingStatus,
  bookingKeys,
  type Booking,
  type BookingQueryParams,
} from "@skybooking/api-client";
import { useTranslation } from "../i18n/client";
import { usePermissions } from "../auth/usePermissions";
import { PERMISSIONS } from "../auth/permissions";
import { useErrorToast } from "../hooks/useErrorToast";
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

export default function BookingListPage() {
  const { t } = useTranslation("bookings");
  const { hasPermission } = usePermissions();
  const canCreate = hasPermission(PERMISSIONS.BOOKING.CREATE);
  const canView = hasPermission(PERMISSIONS.BOOKING.VIEW);
  const canEdit = hasPermission(PERMISSIONS.BOOKING.EDIT);
  const canCancel = hasPermission(PERMISSIONS.BOOKING.CANCEL);

  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<BookingListFilters>({
    storeIds: [],
    statuses: [],
    ...todayRange(),
  });

  const { stores, error: storesError } = useStoresByBrand();
  useErrorToast(storesError);

  const params: BookingQueryParams = useMemo(() => {
    const allStoreIds = stores.map((s) => s.id);
    const effectiveStoreIds = filters.storeIds.length ? filters.storeIds : allStoreIds;

    const effectiveStatuses = filters.statuses.length ? filters.statuses : ALL_BOOKING_STATUSES;

    return {
      keyword: filters.keyword,
      storeIds: effectiveStoreIds,
      status: effectiveStatuses,
      startDate: dayjs(filters.dateFrom).startOf("day").format(),
      endDate: dayjs(filters.dateTo).endOf("day").format(),
    };
  }, [filters, stores]);

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

  const storeNameMap = useMemo(
    () => Object.fromEntries(stores.map((s) => [s.id, s.name])),
    [stores]
  );

  const storeOptions = useMemo(
    () => stores.map((s) => ({ value: s.id, label: s.name })),
    [stores]
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
      <h1 className="font-heading text-xl font-bold text-admin-ink mb-4">
        {t("title")}
      </h1>
      <PageActionContainer className="mb-4">
        <PageActionGroup>
          <BookingFilterBar
            filters={filters}
            storeOptions={storeOptions}
            onKeywordChange={setKeyword}
            onPeriodChange={setPeriod}
            onStoreIdsChange={setStoreIds}
            onStatusesChange={setStatuses}
            t={t}
          />
        </PageActionGroup>
        <PageActionGroup noWrap>
          {canCreate && (
            <Link href="/bookings/new">
              <Button type="primary">{t("createNew")}</Button>
            </Link>
          )}
        </PageActionGroup>
      </PageActionContainer>
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
