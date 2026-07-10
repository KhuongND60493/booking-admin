import { PageHeaderProps } from "../types";

// Biến thể 1: tên thương hiệu + subtitle tĩnh cho trang Home.
export function PageHeader1({ heading, subheading }: PageHeaderProps) {
  return (
    <div className="max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto px-4 pt-6 font-body">
      <h1 className="text-2xl font-heading font-semibold text-ink mb-1">{heading}</h1>
      <p className="text-sm text-ink-muted">{subheading ?? "Chọn nhà hàng để đặt bàn"}</p>
    </div>
  );
}
