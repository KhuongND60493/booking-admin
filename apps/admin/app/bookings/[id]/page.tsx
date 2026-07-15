import BookingDetailPageClient from "./BookingDetailPageClient";

// output:'export' cần generateStaticParams cho dynamic segment [id], nhưng booking ID lấy
// từ DB, không giới hạn — không thể enumerate hết như PAGE_KEYS ở edit-layout. Next.js coi
// mảng RỖNG là "chưa implement" (build vẫn báo lỗi), nên phải trả về ít nhất 1 giá trị
// placeholder để thoả điều kiện prerenderedRoutes.length > 0 — ID thật vẫn vào được bình
// thường qua client-side navigation trong app (chỉ không truy cập trực tiếp bằng URL tĩnh
// cho ID chưa từng được liệt kê).
export function generateStaticParams() {
  return [{ id: "0" }];
}

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <BookingDetailPageClient params={params} />;
}
