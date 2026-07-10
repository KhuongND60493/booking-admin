import { PAGE_KEYS, type PageKey } from "@skybooking/api-client";
import EditLayoutPageClient from "./EditLayoutPageClient";

// output:'export' bắt buộc phải biết trước mọi giá trị của param [page] lúc build —
// PAGE_KEYS là danh sách đầy đủ (khớp app/edit-layout/page.tsx đang liệt kê để làm link).
// generateStaticParams chỉ export được từ Server Component — phần UI tương tác (Puck
// editor, useState/useEffect) nằm ở EditLayoutPageClient.tsx ("use client" riêng).
export function generateStaticParams() {
  return PAGE_KEYS.map((page) => ({ page }));
}

export default async function EditLayoutPagePage({ params }: { params: Promise<{ page: PageKey }> }) {
  const { page } = await params;
  return <EditLayoutPageClient page={page} />;
}
