export interface ReservationMock {
  id: string
  guestName: string
  time: string
  partySize: number
  tableCode: string
  status: 'confirmed' | 'pending' | 'cancelled'
}

export const mockReservations: ReservationMock[] = [
  { id: 'r1', guestName: 'Nguyen Van A', time: '18:30', partySize: 4, tableCode: 'T01', status: 'confirmed' },
  { id: 'r2', guestName: 'Tran Thi B', time: '19:00', partySize: 2, tableCode: 'T05', status: 'pending' },
  { id: 'r3', guestName: 'Le Van C', time: '19:15', partySize: 6, tableCode: 'T12', status: 'confirmed' },
  { id: 'r4', guestName: 'Pham Thi D', time: '20:00', partySize: 3, tableCode: 'T08', status: 'cancelled' },
  { id: 'r5', guestName: 'Hoang Van E', time: '20:30', partySize: 5, tableCode: 'T03', status: 'confirmed' },
]
