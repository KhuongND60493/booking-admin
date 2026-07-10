import { mockTables } from '../mocks/tables.mock'

interface RemoteProps {
  tenantId: string
}

const statusColor: Record<string, string> = {
  available: '#2e7d32',
  occupied: '#c62828',
  reserved: '#f9a825',
}

const statusLabel: Record<string, string> = {
  available: 'Trống',
  occupied: 'Đang dùng',
  reserved: 'Đã đặt',
}

export default function TablesPage({ tenantId }: RemoteProps) {
  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h2>Sơ đồ bàn (demo)</h2>
      <p style={{ color: '#666', fontSize: 13 }}>tenantId: {tenantId}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12, marginTop: 16 }}>
        {mockTables.map((t) => (
          <div
            key={t.id}
            style={{
              border: `2px solid ${statusColor[t.status]}`,
              borderRadius: 8,
              padding: 12,
              textAlign: 'center',
            }}
          >
            <div style={{ fontWeight: 600 }}>{t.code}</div>
            <div style={{ fontSize: 12, color: '#666' }}>{t.capacity} chỗ</div>
            <div style={{ fontSize: 12, color: statusColor[t.status], marginTop: 4 }}>{statusLabel[t.status]}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
