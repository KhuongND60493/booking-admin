import dynamic from 'next/dynamic';

const TablesPage = dynamic(() => import('../../components/pages/TablesPage'), { ssr: false });

export default function Page() {
  return <TablesPage tenantId="tenant-demo-01" />;
}
