'use client'

import dynamic from 'next/dynamic';

const WaitlistPage = dynamic(() => import('@/containers/waitlist'), { ssr: false });

export default function Page() {
  return <WaitlistPage tenantId="tenant-demo-01" />;
}
