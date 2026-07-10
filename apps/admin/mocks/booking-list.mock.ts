export interface BookingListItemMock {
  id: string
  guestName: string
  time: string
  partySize: number
  tableCode: string
  note?: string
  status: 'confirmed' | 'pending' | 'cancelled'
}

export const mockBookingList: BookingListItemMock[] = [
  { id: 'b1', guestName: 'Nguyen Van A', time: '18:30', partySize: 4, tableCode: 'T01', status: 'confirmed' },
  { id: 'b2', guestName: 'Tran Thi B', time: '19:00', partySize: 2, tableCode: 'T05', note: 'Window seat', status: 'pending' },
  { id: 'b3', guestName: 'Le Van C', time: '19:15', partySize: 6, tableCode: 'T12', status: 'confirmed' },
  { id: 'b4', guestName: 'Pham Thi D', time: '20:00', partySize: 3, tableCode: 'T08', status: 'cancelled' },
  { id: 'b5', guestName: 'Hoang Van E', time: '20:30', partySize: 5, tableCode: 'T03', note: 'Birthday', status: 'confirmed' },
]
