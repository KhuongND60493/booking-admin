"use client";

import { useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  tablesApi,
  BookingSource,
  DEFAULT_ORGANIZATION_ID,
  type Booking,
  type CreateBookingPayload,
  type Store,
  type TableResult,
} from "@skybooking/api-client";

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const PHONE_REGEX = /^\+?[0-9]{9,12}$/;
const DEFAULT_BOOKING_DURATION_HOURS = 2;

export interface BookingFormCustomer {
  name: string;
  phone: string;
  email: string;
  note: string;
}

export interface BookingFormState {
  brandId: number | null;
  storeId: string | null;
  date: string;
  time: string;
  partySize: number;
  zone: string | null;
  selectedTableIds: string[];
  customer: BookingFormCustomer;
}

export interface BookingFormSubmitData {
  storeId: string;
  date: string;
  time: string;
  partySize: number;
  tableIds: string[];
  customer: { name: string; phone: string; email?: string; note?: string };
}

function timeFromIso(iso: string | undefined): string {
  return iso ? dayjs(iso).format("HH:mm") : "";
}

export function buildCreateBookingPayload(
  data: BookingFormSubmitData,
  source: BookingSource
): CreateBookingPayload {
  const startTime = `${data.date}T${data.time}:00`;
  const endTime = dayjs(startTime).add(DEFAULT_BOOKING_DURATION_HOURS, "hour").toISOString();
  return {
    organizationId: DEFAULT_ORGANIZATION_ID,
    storeId: Number(data.storeId),
    customerName: data.customer.name,
    customerPhone: data.customer.phone,
    customerEmail: data.customer.email,
    guestCount: data.partySize,
    bookingDate: data.date,
    startTime,
    endTime,
    source,
    note: data.customer.note,
    tableIds: data.tableIds.length > 0 ? data.tableIds.map(Number) : undefined,
  };
}

function buildInitialState(booking: Booking | null): BookingFormState {
  if (!booking) {
    return {
      brandId: null,
      storeId: null,
      date: "",
      time: "",
      partySize: 2,
      zone: null,
      selectedTableIds: [],
      customer: { name: "", phone: "", email: "", note: "" },
    };
  }
  return {
    brandId: null,
    storeId: String(booking.storeId),
    date: booking.bookingDate,
    time: timeFromIso(booking.startTime),
    partySize: booking.guestCount,
    zone: null,
    selectedTableIds: (booking.assignedTables ?? []).map((tbl) => String(tbl.id)),
    customer: {
      name: booking.customerName,
      phone: booking.customerPhone,
      email: booking.customerEmail ?? "",
      note: booking.note ?? "",
    },
  };
}

export function buildTimeSlots(
  openTime: string | null | undefined,
  closeTime: string | null | undefined,
  date: string
): string[] {
  const openStr = openTime || "10:00";
  const closeStr = closeTime || "22:00";
  const [openH, openM] = openStr.split(":").map(Number);
  const [closeH, closeM] = closeStr.split(":").map(Number);

  const slots: string[] = [];
  let cursor = openH * 60 + (openM || 0);
  const end = closeH * 60 + (closeM || 0);
  while (cursor <= end) {
    const h = Math.floor(cursor / 60);
    const m = cursor % 60;
    slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    cursor += 30;
  }

  if (dayjs(date).isSame(dayjs(), "day")) {
    const nowMinutes = dayjs().hour() * 60 + dayjs().minute();
    return slots.filter((slot) => {
      const [h, m] = slot.split(":").map(Number);
      return h * 60 + m > nowMinutes;
    });
  }
  return slots;
}

export function useBookingForm(
  stores: Store[],
  initialBooking: Booking | null,
  onSubmit: (data: BookingFormSubmitData) => Promise<Booking>
) {
  const initialState = useMemo(() => buildInitialState(initialBooking), [initialBooking]);

  const [state, setState] = useState<BookingFormState>(initialState);
  const [tables, setTables] = useState<TableResult[]>([]);
  const [isLoadingTables, setIsLoadingTables] = useState(false);

  const isDirty = useMemo(
    () => JSON.stringify(state) !== JSON.stringify(initialState),
    [state, initialState]
  );

  const setBrandId = (brandId: number | null) =>
    setState((s) => ({ ...s, brandId, storeId: null }));

  const setStoreId = (storeId: string | null) =>
    setState((s) => ({ ...s, storeId, zone: null, selectedTableIds: [] }));
  const setDate = (date: string) => setState((s) => ({ ...s, date, time: "" }));
  const setTime = (time: string) => setState((s) => ({ ...s, time }));
  const setPartySize = (partySize: number) => setState((s) => ({ ...s, partySize }));
  const setZone = (zone: string | null) => setState((s) => ({ ...s, zone }));

  const toggleTable = (id: string) =>
    setState((s) => ({
      ...s,
      selectedTableIds: s.selectedTableIds.includes(id)
        ? s.selectedTableIds.filter((x) => x !== id)
        : [...s.selectedTableIds, id],
    }));

  const setCustomer = (patch: Partial<BookingFormCustomer>) =>
    setState((s) => ({ ...s, customer: { ...s.customer, ...patch } }));

  const loadTables = async () => {
    if (!state.storeId || !state.date || !state.time) return;
    setIsLoadingTables(true);
    try {
      const result = await tablesApi.search({
        storeId: state.storeId,
        date: state.date,
        time: state.time,
        partySize: state.partySize,
      });
      setTables(result);
    } finally {
      setIsLoadingTables(false);
    }
  };

  const timeSlots = useMemo(() => {
    const store = stores.find((s) => String(s.id) === state.storeId);
    return buildTimeSlots(store?.openTime, store?.closeTime, state.date);
  }, [stores, state.storeId, state.date]);

  const zones = useMemo(() => Array.from(new Set(tables.map((t) => t.zone))), [tables]);

  const visibleTables = useMemo(
    () => (state.zone ? tables.filter((t) => t.zone === state.zone) : tables),
    [tables, state.zone]
  );

  const totalCapacity = useMemo(
    () =>
      tables
        .filter((t) => state.selectedTableIds.includes(t.id))
        .reduce((sum, t) => sum + t.capacity, 0),
    [tables, state.selectedTableIds]
  );

  const phoneError = !!state.customer.phone.trim() && !PHONE_REGEX.test(state.customer.phone.trim());
  const emailError = !!state.customer.email.trim() && !EMAIL_REGEX.test(state.customer.email.trim());

  const isValid =
    !!state.storeId &&
    !!state.date &&
    !!state.time &&
    state.partySize > 0 &&
    state.selectedTableIds.length > 0 &&
    state.customer.name.trim().length > 0 &&
    state.customer.phone.trim().length > 0 &&
    !phoneError &&
    !emailError;

  const submit = async (): Promise<Booking> => {
    if (!state.storeId) throw new Error("Missing store");
    return onSubmit({
      storeId: state.storeId,
      date: state.date,
      time: state.time,
      partySize: state.partySize,
      tableIds: state.selectedTableIds,
      customer: {
        name: state.customer.name,
        phone: state.customer.phone,
        email: state.customer.email || undefined,
        note: state.customer.note || undefined,
      },
    });
  };

  return {
    state,
    isEditMode: !!initialBooking,
    setBrandId,
    setStoreId,
    setDate,
    setTime,
    setPartySize,
    setZone,
    toggleTable,
    setCustomer,
    tables,
    visibleTables,
    zones,
    timeSlots,
    totalCapacity,
    isLoadingTables,
    loadTables,
    isDirty,
    isValid,
    phoneError,
    emailError,
    submit,
  };
}
