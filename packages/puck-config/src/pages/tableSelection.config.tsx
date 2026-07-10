import type { Config } from "@measured/puck";
import { ZoneTabs1, TableGridBody1, TableSelectionSummary1 } from "@skybooking/ui";

type Props = {
  ZoneTabs1: Record<string, never>;
  TableGridBody1: Record<string, never>;
  TableSelectionSummary1: Record<string, never>;
};

export const tableSelectionConfig: Config<Props> = {
  categories: {
    tableSelection: {
      title: "Chọn bàn",
      components: ["ZoneTabs1", "TableGridBody1", "TableSelectionSummary1"],
    },
  },
  components: {
    ZoneTabs1: {
      label: "Tab khu vực",
      fields: {},
      defaultProps: {},
      render: () => <ZoneTabs1 />,
    },
    TableGridBody1: {
      label: "Lưới chọn bàn",
      fields: {},
      defaultProps: {},
      render: () => <TableGridBody1 />,
    },
    TableSelectionSummary1: {
      label: "Tổng kết + tiếp tục",
      fields: {},
      defaultProps: {},
      render: () => <TableSelectionSummary1 />,
    },
  },
};

export default tableSelectionConfig;
