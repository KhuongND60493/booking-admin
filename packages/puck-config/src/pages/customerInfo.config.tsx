import type { Config } from "@measured/puck";
import { BookingSummaryCard1, ContactInfoForm1 } from "@skybooking/ui";

type Props = {
  BookingSummaryCard1: { showBookingCode?: boolean };
  ContactInfoForm1: { heading: string };
};

export const customerInfoConfig: Config<Props> = {
  categories: {
    customerInfo: { title: "Thông tin khách hàng", components: ["BookingSummaryCard1", "ContactInfoForm1"] },
  },
  components: {
    BookingSummaryCard1: {
      label: "Tóm tắt đặt bàn",
      fields: { showBookingCode: { type: "radio", options: [{ label: "Có", value: true }, { label: "Không", value: false }] } },
      defaultProps: { showBookingCode: false },
      render: ({ puck, ...props }) => <BookingSummaryCard1 {...props} />,
    },
    ContactInfoForm1: {
      label: "Form thông tin liên hệ",
      fields: { heading: { type: "text" } },
      defaultProps: { heading: "Thông tin đặt bàn" },
      render: ({ puck, ...props }) => <ContactInfoForm1 {...props} />,
    },
  },
};

export default customerInfoConfig;
