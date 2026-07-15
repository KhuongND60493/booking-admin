export interface Brand {
  id: number;
  organizationId: number;
  name: string;
  code: string;
  status: number;
  guidString: string;
}

export enum StoreStatus {
  Deleted = 0,
  Draft = 1,
  Inactive = 2,
  Active = 3,
  Preset = 4,
}

export const STORE_STATUS_I18N_KEY: Record<StoreStatus, string> = {
  [StoreStatus.Deleted]: "deleted",
  [StoreStatus.Draft]: "draft",
  [StoreStatus.Inactive]: "inactive",
  [StoreStatus.Active]: "active",
  [StoreStatus.Preset]: "preset",
};

export const ALL_STORE_STATUSES: StoreStatus[] = [
  StoreStatus.Deleted,
  StoreStatus.Draft,
  StoreStatus.Inactive,
  StoreStatus.Active,
  StoreStatus.Preset,
];

export interface Store {
  id: number;
  organizationId?: number;
  name: string;
  code?: number;
  status: StoreStatus;
  conceptId?: number;
  conceptName?: string;
  address?: string | null;
  phone?: string | null;
  website?: string | null;
  description?: string | null;
  openTime?: string | null;
  closeTime?: string | null;
  bannerId?: number;
  bannerUrl?: string | null;
  photoId?: number;
  photoUrl?: string | null;
  guidString: string;
}

export interface StoreThemeColors {
  primary: string;
  background: string;
  text: string;
  textMuted: string;
}

export interface StoreThemeFonts {
  heading: string;
  body: string;
}

export interface StoreTheme {
  storeId: string;
  colors: StoreThemeColors;
  fonts: StoreThemeFonts;
}

export type PageKey =
  | "home"
  | "storeDetail"
  | "tableSelection"
  | "customerInfo"
  | "otp"
  | "success"
  | "waitlist";

export const PAGE_KEYS: PageKey[] = [
  "home",
  "storeDetail",
  "tableSelection",
  "customerInfo",
  "otp",
  "success",
  "waitlist",
];

export interface PageConfigComponent {
  type: string;
  props: Record<string, unknown>;
}

export interface PageConfigData {
  storeId: string;
  page: PageKey;
  components: PageConfigComponent[];
}

export enum BookingStatus {
  Draft = 0,
  Pending = 1,
  Confirmed = 2,
  CheckedIn = 3,
  Seated = 4,
  Completed = 5,
  Cancelled = 6,
  NoShow = 7,
  Expired = 8,
}

export const BOOKING_STATUS_I18N_KEY: Record<BookingStatus, string> = {
  [BookingStatus.Draft]: "draft",
  [BookingStatus.Pending]: "pending",
  [BookingStatus.Confirmed]: "confirmed",
  [BookingStatus.CheckedIn]: "checked-in",
  [BookingStatus.Seated]: "seated",
  [BookingStatus.Completed]: "completed",
  [BookingStatus.Cancelled]: "cancelled",
  [BookingStatus.NoShow]: "no-show",
  [BookingStatus.Expired]: "expired",
};

export const ALL_BOOKING_STATUSES: BookingStatus[] = [
  BookingStatus.Draft,
  BookingStatus.Pending,
  BookingStatus.Confirmed,
  BookingStatus.CheckedIn,
  BookingStatus.Seated,
  BookingStatus.Completed,
  BookingStatus.Cancelled,
  BookingStatus.NoShow,
  BookingStatus.Expired,
];

export enum BookingSource {
  Web = 0,
  App = 1,
  Staff = 2,
}

export enum BookingTableStatus {
  Available = 0,
  Occupied = 1,
  Reserved = 2,
  Locked = 3,
}

export interface BookingTable {
  id: number;
  storeId: number;
  tableCode: string;
  tableName: string;
  areaId?: number;
  capacity?: number;
  minCapacity?: number;
  maxCapacity?: number;
  status: BookingTableStatus;
  isActive: boolean;
}

export interface BookingTableRow {
  id: number;
  organizationId: number;
  storeId: number;
  refId?: number | null;
  tableCode?: string | null;
  tableName?: string | null;
  areaId: number;
  capacity?: number | null;
  minCapacity?: number | null;
  maxCapacity: number;
  isActive: boolean;
}

export interface BookingTableAssignment {
  id: number;
  bookingId: number;
  tableId: number;
  assignedAt: string;
}

export interface BookingStatusHistory {
  id: number;
  bookingId: number;
  oldStatus: BookingStatus;
  newStatus: BookingStatus;
  action: string;
  note?: string;
  createdBy: string;
  createdDate: string;
}

export interface Booking {
  id: number;
  bookingCode: string;
  organizationId: number;
  storeId: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  guestCount: number;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  source: BookingSource;
  note?: string;
  createdDate: string;
  confirmedDate?: string;
  checkedInDate?: string;
  cancelledDate?: string;
  cancelReason?: string;
  createdById?: string;
  updatedById?: string;
  lastUpdated?: string;
  assignedTables?: BookingTable[];
}

export interface WaitlistEntry {
  id: string;
  storeId: string;
  customer: Pick<BookingCustomer, "name" | "phone">;
  partySize: number;
  preferredTime: string;
  createdAt: string;
  converted: boolean;
}

export interface BookingCustomer {
  name: string;
  phone: string;
  email?: string;
  note?: string;
}

export enum BookingDayOfWeek {
  Monday = 1,
  Tuesday = 2,
  Wednesday = 4,
  Thursday = 8,
  Friday = 16,
  Saturday = 32,
  Sunday = 64,
}

export const ALL_BOOKING_DAYS_OF_WEEK: BookingDayOfWeek[] = [
  BookingDayOfWeek.Monday,
  BookingDayOfWeek.Tuesday,
  BookingDayOfWeek.Wednesday,
  BookingDayOfWeek.Thursday,
  BookingDayOfWeek.Friday,
  BookingDayOfWeek.Saturday,
  BookingDayOfWeek.Sunday,
];

export const ALL_BOOKING_DAYS_OF_WEEK_MASK = ALL_BOOKING_DAYS_OF_WEEK.reduce(
  (sum, day) => sum + day,
  0
);

export const BOOKING_DAY_OF_WEEK_I18N_KEY: Record<BookingDayOfWeek, string> = {
  [BookingDayOfWeek.Monday]: "monday",
  [BookingDayOfWeek.Tuesday]: "tuesday",
  [BookingDayOfWeek.Wednesday]: "wednesday",
  [BookingDayOfWeek.Thursday]: "thursday",
  [BookingDayOfWeek.Friday]: "friday",
  [BookingDayOfWeek.Saturday]: "saturday",
  [BookingDayOfWeek.Sunday]: "sunday",
};

export interface BookingTimeSlot {
  id: number;
  organizationId: number;
  storeIds: number[] | null;
  name?: string | null;
  startTime: string;
  endTime: string;
  isActive: boolean;
  sortOrder?: number | null;
  daysOfWeek: number;
}

export interface BookingSetting {
  holdDurationMinutes: number;
  holdDurationMinutes_OverrideForStore: boolean;
  gracePeriodMinutes: number;
  gracePeriodMinutes_OverrideForStore: boolean;
  maxGuestPerTable: number;
  maxGuestPerTable_OverrideForStore: boolean;
}
