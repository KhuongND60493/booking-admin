import { mockLayoutTables } from '../../mocks/layout.mock'
import { t } from '../../lib/i18n/translate'

interface Props {
  tenantId: string
  locale?: string
  parentPage?: number
}

const statusColor: Record<string, string> = {
  available: '#2e7d32',
  occupied: '#c62828',
  reserved: '#f9a825',
}

const statusKey: Record<string, string> = {
  available: 'layout_status_available',
  occupied: 'layout_status_occupied',
  reserved: 'layout_status_reserved',
}

export default function LayoutEditorPage({ tenantId, locale, parentPage = -1 }: Props) {
  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>{t(locale, 'layout_title')}</h2>
        <button type="button" disabled>
          {t(locale, 'layout_save_button')}
        </button>
      </div>
      <p style={{ color: '#666', fontSize: 13 }}>
        {t(locale, 'tenant_id_label')}: {tenantId} — {t(locale, 'parent_page_label')}: {parentPage} —{' '}
        {t(locale, 'app_env_label')}: {process.env.NEXT_PUBLIC_APP_ENV ?? 'unknown'}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12, marginTop: 16 }}>
        {mockLayoutTables.map((tbl) => (
          <div
            key={tbl.id}
            style={{
              border: `2px solid ${statusColor[tbl.status]}`,
              borderRadius: 8,
              padding: 12,
              textAlign: 'center',
            }}
          >
            <div style={{ fontWeight: 600 }}>{tbl.code}</div>
            <div style={{ fontSize: 12, color: '#666' }}>
              {tbl.capacity} {t(locale, 'layout_capacity_suffix')}
            </div>
            <div style={{ fontSize: 12, color: statusColor[tbl.status], marginTop: 4 }}>
              {t(locale, statusKey[tbl.status])}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
