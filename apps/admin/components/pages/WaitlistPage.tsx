import { mockWaitlist } from '../../mocks/waitlist.mock'
import { t } from '../../lib/i18n/translate'

interface Props {
  tenantId: string
  locale?: string
  parentPage?: number
}

const statusKey: Record<string, string> = {
  waiting: 'waitlist_status_waiting',
  notified: 'waitlist_status_notified',
  seated: 'waitlist_status_seated',
  cancelled: 'waitlist_status_cancelled',
}

export default function WaitlistPage({ tenantId, locale, parentPage = -1 }: Props) {
  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h2>{t(locale, 'waitlist_title')}</h2>
      <p style={{ color: '#666', fontSize: 13 }}>
        {t(locale, 'tenant_id_label')}: {tenantId} — {t(locale, 'parent_page_label')}: {parentPage} —{' '}
        {t(locale, 'app_env_label')}: {process.env.NEXT_PUBLIC_APP_ENV ?? 'unknown'}
      </p>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
            <th style={{ padding: 8 }}>{t(locale, 'waitlist_col_guest')}</th>
            <th style={{ padding: 8 }}>{t(locale, 'waitlist_col_requested_time')}</th>
            <th style={{ padding: 8 }}>{t(locale, 'waitlist_col_party_size')}</th>
            <th style={{ padding: 8 }}>{t(locale, 'waitlist_col_waiting_since')}</th>
            <th style={{ padding: 8 }}>{t(locale, 'waitlist_col_status')}</th>
          </tr>
        </thead>
        <tbody>
          {mockWaitlist.map((w) => (
            <tr key={w.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: 8 }}>{w.guestName}</td>
              <td style={{ padding: 8 }}>{w.requestedTime}</td>
              <td style={{ padding: 8 }}>{w.partySize}</td>
              <td style={{ padding: 8 }}>{w.waitingSince}</td>
              <td style={{ padding: 8 }}>{t(locale, statusKey[w.status])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
