export const BOOKING_ERROR_I18N_KEY: Record<number, string> = {
  200: "toast.error.notFound",
  201: "toast.error.invalidTransition",
  202: "toast.error.capacityExceeded",
  203: "toast.error.tableUnavailable",
  204: "toast.error.incorrectPhone",
  205: "toast.error.settingsMissing",
  206: "toast.error.tableRequired",
};

export const BOOKING_ERROR_DEFAULT_MESSAGE_VI: Record<number, string> = {
  200: "Booking không tồn tại",
  201: "Chuyển trạng thái không hợp lệ",
  202: "Tổng sức chứa bàn không đủ cho số khách",
  203: "Bàn không khả dụng hoặc đang trùng giờ với bookings khác",
  204: "Số điện thoại không hợp lệ",
  205: "Thiếu cấu hình đặt bàn cho cửa hàng này",
  206: "Cần gán bàn trước khi xác nhận bookings",
};
