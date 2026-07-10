import type { Config } from "@measured/puck";
import { StoreHeader1, DateTimePartyForm1 } from "@skybooking/ui";

type Props = {
  StoreHeader1: Record<string, never>;
  DateTimePartyForm1: { title: string };
};

export const storeDetailConfig: Config<Props> = {
  categories: {
    storeDetail: { title: "Chi tiết nhà hàng", components: ["StoreHeader1", "DateTimePartyForm1"] },
  },
  components: {
    StoreHeader1: {
      label: "Header nhà hàng",
      fields: {},
      defaultProps: {},
      render: () => <StoreHeader1 />,
    },
    DateTimePartyForm1: {
      label: "Chọn thời gian",
      fields: { title: { type: "text" } },
      defaultProps: { title: "Chọn thời gian" },
      render: ({ puck, ...props }) => <DateTimePartyForm1 {...props} />,
    },
  },
};

export default storeDetailConfig;
