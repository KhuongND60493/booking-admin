import { z } from "zod";
import { BookingSource, BookingStatus, BookingTableStatus } from "../types";

export const bookingTableSchema = z.object({
  id: z.number(),
  storeId: z.number(),
  tableCode: z.string(),
  tableName: z.string(),
  areaId: z.number().optional(),
  capacity: z.number().optional(),
  minCapacity: z.number().optional(),
  maxCapacity: z.number().optional(),
  status: z.nativeEnum(BookingTableStatus),
  isActive: z.boolean(),
});

export const bookingStatusHistorySchema = z.object({
  id: z.number(),
  bookingId: z.number(),
  oldStatus: z.nativeEnum(BookingStatus),
  newStatus: z.nativeEnum(BookingStatus),
  action: z.string(),
  note: z.string().optional(),
  createdBy: z.string(),
  createdDate: z.string(),
});

export const bookingSchema = z.object({
  id: z.number(),
  bookingCode: z.string(),
  organizationId: z.number(),
  storeId: z.number(),
  customerName: z.string(),
  customerPhone: z.string(),
  customerEmail: z.string().optional(),
  guestCount: z.number(),
  bookingDate: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  status: z.nativeEnum(BookingStatus),
  source: z.nativeEnum(BookingSource),
  note: z.string().optional(),
  createdDate: z.string(),
  confirmedDate: z.string().optional(),
  checkedInDate: z.string().optional(),
  cancelledDate: z.string().optional(),
  cancelReason: z.string().optional(),
  createdById: z.string().optional(),
  updatedById: z.string().optional(),
  lastUpdated: z.string().optional(),
  assignedTables: z.array(bookingTableSchema).optional(),
});

export const bookingListSchema = z.object({
  totalCount: z.number(),
  records: z.array(bookingSchema),
});
