import { BaseApi } from "./http/baseApi";
import { ENDPOINTS } from "./config/endpoints";
import { DEFAULT_ORGANIZATION_ID } from "./config/organization";
import type { Store, StoreStatus } from "./types";
import { storeSchema, storeListResultSchema } from "./schemas/store";

const MAX_LIMIT = 9999;

export interface StoreListParams {
  orgId?: number;
  regionId?: string;
  conceptId?: string;
  search?: string;
  status?: string;
  includeMainStore?: boolean;
  showHidden?: boolean;
  offset?: number;
  limit?: number;
  orderBy?: string;
}

interface StoreListResult {
  totalCount: number;
  records: Store[];
}

export interface CreateStorePayload {
  organizationId: number;
  name: string;
  conceptId: number;
  status: StoreStatus;
  address?: string;
  phone?: string;
  website?: string;
  description?: string;
  openTime?: string;
  closeTime?: string;
  bannerId?: number;
  photoId?: number;
}

export type UpdateStorePayload = Partial<CreateStorePayload>;

class StoresApi extends BaseApi {
  constructor() {
    super(ENDPOINTS.stores);
  }

  async list(params: StoreListParams = {}): Promise<Store[]> {
    const result = await this.get<StoreListResult>(
      "",
      {
        orgId: params.orgId ?? DEFAULT_ORGANIZATION_ID,
        regionId: params.regionId,
        conceptId: params.conceptId,
        search: params.search,
        status: params.status,
        includeMainStore: params.includeMainStore,
        showHidden: params.showHidden,
        offset: params.offset,
        limit: params.limit ?? MAX_LIMIT,
        orderBy: params.orderBy,
      },
      { validator: storeListResultSchema }
    );
    return result.records;
  }

  getOne(storeId: string | number): Promise<Store> {
    return this.get<Store>(`/${storeId}`, undefined, { validator: storeSchema });
  }

  create(payload: CreateStorePayload): Promise<Store> {
    return this.post<Store>("", payload, { validator: storeSchema });
  }

  update(id: number, payload: UpdateStorePayload): Promise<Store> {
    return this.put<Store>("", { id, ...payload }, { validator: storeSchema });
  }

  deleteMany(ids: number[]): Promise<void> {
    return this.deleteWithBody<void>("", ids);
  }
}

export const storesApi = new StoresApi();
