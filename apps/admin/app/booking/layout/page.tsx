'use client'

import dynamic from 'next/dynamic';

const LayoutEditorPage = dynamic(() => import('../../../components/pages/LayoutEditorPage'), { ssr: false });

export default function Page() {
  return <LayoutEditorPage tenantId="tenant-demo-01" />;
}
