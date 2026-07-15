import { PAGE_KEYS, type PageKey } from "@skybooking/api-client";
import EditLayoutPageClient from "./EditLayoutPageClient";

// output:'export' cần biết trước toàn bộ giá trị của dynamic segment [page] để prerender —
// PAGE_KEYS là tập hữu hạn (không giống ID booking không giới hạn), enumerate hết được.
export function generateStaticParams() {
  return PAGE_KEYS.map((page) => ({ page }));
}

export default function EditLayoutPagePage({ params }: { params: Promise<{ page: PageKey }> }) {
  return <EditLayoutPageClient params={params} />;
}
