'use client'

import dynamic from 'next/dynamic';

const WaitlistPage = dynamic(() => import('../../components/pages/WaitlistPage'), { ssr: false });

export default function Page() {
  return <WaitlistPage tenantId="tenant-demo-01" />;
}
