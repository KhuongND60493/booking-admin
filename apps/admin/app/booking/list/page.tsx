'use client'

import dynamic from 'next/dynamic';

// ssr:false bắt buộc: booking-admin không cần SSR, và khi build cùng
// ModuleFederationPlugin, prerender ở build-time gây xung đột với "shared react"
// (federation shares chỉ resolve đúng lúc runtime trong trình duyệt, không phải lúc build).
const BookingListPage = dynamic(() => import('../../../components/pages/BookingListPage'), { ssr: false });

export default function Page() {
  return <BookingListPage tenantId="tenant-demo-01" />;
}
