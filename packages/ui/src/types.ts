// Type props chung cho từng nhóm màn hình (theo cấu trúc trang mới, đã chia
// nhỏ theo khối UI — SPEC-bookings-responsive-containers-theme-config).
import type { Store } from "@skybooking/api-client";

// Home
export interface PageHeaderProps {
  heading: string;
  subheading?: string;
}
export interface BrandFilterBarProps {}
export interface StoreListProps {}

// Store Detail
export interface StoreHeaderProps {}
export interface DateTimePartyFormProps {
  title: string;
}

// Table Selection
export interface ZoneTabsProps {}
export interface TableGridBodyProps {}
export interface TableSelectionSummaryProps {}

// Shared
export interface BookingSummaryCardProps {
  showBookingCode?: boolean;
}

// Customer Info
export interface ContactInfoFormProps {
  heading: string;
}

// OTP
export interface OtpHeaderProps {
  heading: string;
}
export interface OtpCodeInputProps {}

// Success
export interface SuccessHeaderProps {
  heading: string;
}
export interface SuccessActionsProps {}

// Waitlist
export interface WaitlistIntroProps {}
export interface WaitlistFormFieldsProps {
  heading: string;
}

export type { Store };
