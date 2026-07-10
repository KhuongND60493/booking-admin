import { mockBookingList } from '../../mocks/booking-list.mock'
import { t } from '../../lib/i18n/translate'

interface Props {
    tenantId: string
    locale?: string
    parentPage?: number
}

const statusKey: Record<string, string> = {
    confirmed: 'booking_status_confirmed',
    pending: 'booking_status_pending',
    cancelled: 'booking_status_cancelled',
}

export default function BookingListPage({ tenantId, locale, parentPage = -1 }: Props) {
    return (
        <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
            <h2>{t(locale, 'booking_list_title')}</h2>
            <p style={{ color: '#666', fontSize: 13 }}>
                {t(locale, 'tenant_id_label')}: {tenantId} — {t(locale, 'parent_page_label')}: {parentPage} —{' '}
                {t(locale, 'app_env_label')}: {process.env.NEXT_PUBLIC_APP_ENV ?? 'unknown'}
            </p>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
                <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                    <th style={{ padding: 8 }}>{t(locale, 'booking_list_col_guest')}</th>
                    <th style={{ padding: 8 }}>{t(locale, 'booking_list_col_time')}</th>
                    <th style={{ padding: 8 }}>{t(locale, 'booking_list_col_party_size')}</th>
                    <th style={{ padding: 8 }}>{t(locale, 'booking_list_col_table')}</th>
                    <th style={{ padding: 8 }}>{t(locale, 'booking_list_col_note')}</th>
                    <th style={{ padding: 8 }}>{t(locale, 'booking_list_col_status')}</th>
                </tr>
                </thead>
                <tbody>
                {mockBookingList.map((r) => (
                    <tr key={r.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: 8 }}>{r.guestName}</td>
                        <td style={{ padding: 8 }}>{r.time}</td>
                        <td style={{ padding: 8 }}>{r.partySize}</td>
                        <td style={{ padding: 8 }}>{r.tableCode}</td>
                        <td style={{ padding: 8 }}>{r.note ?? '-'}</td>
                        <td style={{ padding: 8 }}>{t(locale, statusKey[r.status])}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}
