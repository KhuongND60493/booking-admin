export interface WaitlistItemMock {
  id: string
  guestName: string
  requestedTime: string
  partySize: number
  waitingSince: string
  status: 'waiting' | 'notified' | 'seated' | 'cancelled'
}

export const mockWaitlist: WaitlistItemMock[] = [
  { id: 'w1', guestName: 'Do Van F', requestedTime: '19:00', partySize: 2, waitingSince: '18:45', status: 'waiting' },
  { id: 'w2', guestName: 'Bui Thi G', requestedTime: '19:30', partySize: 4, waitingSince: '19:05', status: 'notified' },
  { id: 'w3', guestName: 'Vu Van H', requestedTime: '20:00', partySize: 3, waitingSince: '19:20', status: 'seated' },
  { id: 'w4', guestName: 'Dang Thi I', requestedTime: '20:15', partySize: 5, waitingSince: '19:40', status: 'cancelled' },
]
