export interface LayoutTableMock {
  id: string
  code: string
  capacity: number
  status: 'available' | 'occupied' | 'reserved'
}

export const mockLayoutTables: LayoutTableMock[] = [
  { id: 't1', code: 'T01', capacity: 4, status: 'occupied' },
  { id: 't2', code: 'T02', capacity: 2, status: 'available' },
  { id: 't3', code: 'T03', capacity: 6, status: 'reserved' },
  { id: 't4', code: 'T04', capacity: 4, status: 'available' },
  { id: 't5', code: 'T05', capacity: 2, status: 'reserved' },
  { id: 't6', code: 'T06', capacity: 8, status: 'available' },
]
