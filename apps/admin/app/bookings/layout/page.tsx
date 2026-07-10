'use client'

import dynamic from 'next/dynamic';

const LayoutEditorPage = dynamic(() => import('@/containers/layout'), { ssr: false });

export default function Page() {
  return <LayoutEditorPage tenantId="tenant-demo-01" />;
}
