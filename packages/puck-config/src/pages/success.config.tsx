import type { Config } from "@measured/puck";
import { SuccessHeader1, BookingSummaryCard1, SuccessActions1 } from "@skybooking/ui";

type Props = {
  SuccessHeader1: { heading: string };
  BookingSummaryCard1: { showBookingCode?: boolean };
  SuccessActions1: Record<string, never>;
};

export const successConfig: Config<Props> = {
  categories: {
    success: { title: "Xác nhận thành công", components: ["SuccessHeader1", "BookingSummaryCard1", "SuccessActions1"] },
  },
  components: {
    SuccessHeader1: {
      label: "Icon + tiêu đề",
      fields: { heading: { type: "text" } },
      defaultProps: { heading: "Đặt bàn thành công!" },
      render: ({ puck, ...props }) => <SuccessHeader1 {...props} />,
    },
    BookingSummaryCard1: {
      label: "Tóm tắt đặt bàn",
      fields: { showBookingCode: { type: "radio", options: [{ label: "Có", value: true }, { label: "Không", value: false }] } },
      defaultProps: { showBookingCode: true },
      render: ({ puck, ...props }) => <BookingSummaryCard1 {...props} />,
    },
    SuccessActions1: {
      label: "Nút hành động",
      fields: {},
      defaultProps: {},
      render: () => <SuccessActions1 />,
    },
  },
};

export default successConfig;
