import { BaseApi } from "./http/baseApi";
import { ENDPOINTS } from "./config/endpoints";
import { tableResultListSchema } from "./schemas/table";

export interface TableResult {
  id: string;
  name: string;
  capacity: number;
  available: boolean;
  location: string;
  zone: string;
}

export const ZONES = ["Tầng trệt", "Sân vườn", "VIP"];

export interface SearchTablesParams {
  storeId?: string;
  date?: string;
  time?: string;
  partySize?: number;
}

class TablesApi extends BaseApi {
  constructor() {
    super(ENDPOINTS.tables);
  }

  search(params: SearchTablesParams): Promise<TableResult[]> {
    return this.get<TableResult[]>(
      "",
      {
        storeId: params.storeId,
        date: params.date,
        time: params.time,
        partySize: params.partySize,
      },
      { validator: tableResultListSchema }
    );
  }
}

export const tablesApi = new TablesApi();
