'use client'

import dynamic from 'next/dynamic';
const EditLayoutPage = dynamic(() => import('@/containers/layout'), { ssr: false });

export default function Page() {
    return <EditLayoutPage tenantId="tenant-demo-01" />;
}
