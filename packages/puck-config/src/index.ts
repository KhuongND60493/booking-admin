import type { Config } from "@measured/puck";
import type { PageKey } from "@skybooking/api-client";
import { homeConfig } from "./pages/home.config";
import { storeDetailConfig } from "./pages/storeDetail.config";
import { tableSelectionConfig } from "./pages/tableSelection.config";
import { customerInfoConfig } from "./pages/customerInfo.config";
import { otpConfig } from "./pages/otp.config";
import { successConfig } from "./pages/success.config";
import { waitlistConfig } from "./pages/waitlist.config";

// Registry Puck theo TỪNG TRANG (thay cho 1 registry global duy nhất cũ) —
// theo BR-8: khi admin chọn 1 trang để chỉnh sửa, chỉ load đúng registry của
// trang đó, không load toàn bộ component của mọi trang cùng lúc.
export const pageConfigs: Record<PageKey, Config<any>> = {
  home: homeConfig,
  storeDetail: storeDetailConfig,
  tableSelection: tableSelectionConfig,
  customerInfo: customerInfoConfig,
  otp: otpConfig,
  success: successConfig,
  waitlist: waitlistConfig,
};

export function getConfigForPage(page: PageKey): Config<any> {
  return pageConfigs[page];
}

// Danh sách component + props mặc định khi store chưa từng publish config cho
// trang này — khớp defaultProps đã khai báo trong từng pages/*.config.tsx.
// Mỗi trang giờ có NHIỀU component mặc định (đã chia nhỏ theo khối UI — SPEC
// bookings-responsive-containers-theme-config), thứ tự trong mảng = thứ tự hiển thị.
const DEFAULT_COMPONENTS: Record<PageKey, { type: string; props: Record<string, unknown> }[]> = {
  home: [
    { type: "PageHeader1", props: { heading: "Cửu Vân Long", subheading: "Chọn nhà hàng để đặt bàn" } },
    { type: "BrandFilterBar1", props: {} },
    { type: "StoreList1", props: {} },
  ],
  storeDetail: [
    { type: "StoreHeader1", props: {} },
    { type: "DateTimePartyForm1", props: { title: "Chọn thời gian" } },
  ],
  tableSelection: [
    { type: "ZoneTabs1", props: {} },
    { type: "TableGridBody1", props: {} },
    { type: "TableSelectionSummary1", props: {} },
  ],
  customerInfo: [
    { type: "BookingSummaryCard1", props: { showBookingCode: false } },
    { type: "ContactInfoForm1", props: { heading: "Thông tin đặt bàn" } },
  ],
  otp: [
    { type: "OtpHeader1", props: { heading: "Nhập mã xác thực" } },
    { type: "OtpCodeInput1", props: {} },
  ],
  success: [
    { type: "SuccessHeader1", props: { heading: "Đặt bàn thành công!" } },
    { type: "BookingSummaryCard1", props: { showBookingCode: true } },
    { type: "SuccessActions1", props: {} },
  ],
  waitlist: [
    { type: "WaitlistIntro1", props: {} },
    { type: "WaitlistFormFields1", props: { heading: "Đăng ký chờ bàn" } },
  ],
};

// Chuyển PageConfigData (hình dạng lưu trong @skybooking/api-client) sang Data
// mà <Render>/<Puck> của @measured/puck cần. Nếu config null (chưa publish),
// dùng danh sách component mặc định theo trang.
export function toPuckData(page: PageKey, config: { components: { type: string; props: Record<string, unknown> }[] } | null) {
  const components = config?.components?.length ? config.components : DEFAULT_COMPONENTS[page];
  return {
    content: components.map((c, i) => ({
      type: c.type,
      props: { id: `${c.type}-${i}`, ...c.props },
    })),
    root: { props: {} },
    zones: {},
  };
}

export {
  homeConfig,
  storeDetailConfig,
  tableSelectionConfig,
  customerInfoConfig,
  otpConfig,
  successConfig,
  waitlistConfig,
};
