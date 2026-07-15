import type { BookingTableRow } from "@skybooking/api-client";

export interface AreaGroup {
  areaId: number;
  tables: BookingTableRow[];
}

export interface StoreGroup {
  storeId: number;
  areas: AreaGroup[];
}

export function groupTablesByStoreAndArea(rows: BookingTableRow[]): StoreGroup[] {
  const storeOrder: number[] = [];
  const storeMap = new Map<number, Map<number, BookingTableRow[]>>();

  for (const row of rows) {
    if (!storeMap.has(row.storeId)) {
      storeMap.set(row.storeId, new Map());
      storeOrder.push(row.storeId);
    }
    const areaMap = storeMap.get(row.storeId)!;
    if (!areaMap.has(row.areaId)) {
      areaMap.set(row.areaId, []);
    }
    areaMap.get(row.areaId)!.push(row);
  }

  return storeOrder.map((storeId) => {
    const areaMap = storeMap.get(storeId)!;
    const areas: AreaGroup[] = Array.from(areaMap.entries()).map(([areaId, tables]) => ({
      areaId,
      tables,
    }));
    return { storeId, areas };
  });
}
