'use client'

import dynamic from 'next/dynamic';
const ComponentPage = dynamic(() => import('@/containers/bookings/new'), { ssr: false });

export default function Page() {
  return <ComponentPage tenantId="tenant-demo-01" />;
}
