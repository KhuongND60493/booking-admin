'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
const BookingDetailPage = dynamic(() => import('@/containers/bookings/detail'), { ssr: false });
function BookingDetailRoute() {
  const searchParams = useSearchParams();
  const id = Number(searchParams.get('id'));
  return <BookingDetailPage id={id} />;
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <BookingDetailRoute />
    </Suspense>
  );
}
