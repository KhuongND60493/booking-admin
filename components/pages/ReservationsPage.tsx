import { mockReservations } from '../../mocks/reservations.mock'

interface Props {
  tenantId: string;
}

const statusLabel: Record<string, string> = {
  confirmed: 'Đã xác nhận',
  pending: 'Chờ xác nhận',
  cancelled: 'Đã huỷ',
}

/**
 * Component này được expose ra qua remoteEntry.js (xem next.config.js -> exposes).
 * Khi nhúng vào resto, nó chạy TRONG cây React của resto (mount runtime),
 * không phải iframe, không phải full page reload.
 */
export default function ReservationsPage({ tenantId }: Props) {
  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h2>Đặt bàn (demo)</h2>
      <p style={{ color: '#666', fontSize: 13 }}>tenantId: {tenantId}</p>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
            <th style={{ padding: 8 }}>Khách</th>
            <th style={{ padding: 8 }}>Giờ</th>
            <th style={{ padding: 8 }}>Số khách</th>
            <th style={{ padding: 8 }}>Bàn</th>
            <th style={{ padding: 8 }}>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {mockReservations.map((r) => (
            <tr key={r.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: 8 }}>{r.guestName}</td>
              <td style={{ padding: 8 }}>{r.time}</td>
              <td style={{ padding: 8 }}>{r.partySize}</td>
              <td style={{ padding: 8 }}>{r.tableCode}</td>
              <td style={{ padding: 8 }}>{statusLabel[r.status]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
