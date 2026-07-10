'use client'

import dynamic from 'next/dynamic';

const BookingListPage = dynamic(() => import('@/containers/bookings'), { ssr: false });

export default function Page() {
  return <BookingListPage tenantId="tenant-demo-01" />;
}
