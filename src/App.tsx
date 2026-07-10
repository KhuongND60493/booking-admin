import { useState } from 'react'
import ReservationsPage from './pages/ReservationsPage'
import TablesPage from './pages/TablesPage'

const TENANT_ID = 'tenant-demo-01'

function App() {
  const [tab, setTab] = useState<'reservations' | 'tables'>('reservations')

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <nav style={{ display: 'flex', gap: 8, padding: 16, borderBottom: '1px solid #ddd' }}>
        <button type="button" onClick={() => setTab('reservations')}>
          Reservations
        </button>
        <button type="button" onClick={() => setTab('tables')}>
          Tables
        </button>
      </nav>
      {tab === 'reservations' ? <ReservationsPage tenantId={TENANT_ID} /> : <TablesPage tenantId={TENANT_ID} />}
    </div>
  )
}

export default App
