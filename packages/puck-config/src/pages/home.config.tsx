import type { Config } from "@measured/puck";
import { PageHeader1, BrandFilterBar1, StoreList1 } from "@skybooking/ui";

type Props = {
  PageHeader1: { heading: string; subheading?: string };
  BrandFilterBar1: Record<string, never>;
  StoreList1: Record<string, never>;
};

export const homeConfig: Config<Props> = {
  categories: {
    home: { title: "Trang chủ", components: ["PageHeader1", "BrandFilterBar1", "StoreList1"] },
  },
  components: {
    PageHeader1: {
      label: "Tiêu đề trang",
      fields: { heading: { type: "text" }, subheading: { type: "text" } },
      defaultProps: { heading: "Cửu Vân Long", subheading: "Chọn nhà hàng để đặt bàn" },
      render: ({ puck, ...props }) => <PageHeader1 {...props} />,
    },
    BrandFilterBar1: {
      label: "Chip lọc thương hiệu",
      fields: {},
      defaultProps: {},
      render: () => <BrandFilterBar1 />,
    },
    StoreList1: {
      label: "Danh sách nhà hàng",
      fields: {},
      defaultProps: {},
      render: () => <StoreList1 />,
    },
  },
};

export default homeConfig;
