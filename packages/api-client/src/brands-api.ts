import { BaseApi } from "./http/baseApi";
import { ENDPOINTS } from "./config/endpoints";
import { DEFAULT_ORGANIZATION_ID } from "./config/organization";
import type { Brand } from "./types";
import { brandListResultSchema } from "./schemas/brand";

export interface BrandListParams {
  orgId?: number;
  search?: string;
  status?: string;
  offset?: number;
  limit?: number;
  orderBy?: string;
}

interface BrandListResult {
  totalCount: number;
  records: Brand[];
}

class BrandsApi extends BaseApi {
  constructor() {
    super(ENDPOINTS.brands);
  }

  async list(params: BrandListParams = {}): Promise<Brand[]> {
    const result = await this.get<BrandListResult>(
      "",
      {
        orgId: params.orgId ?? DEFAULT_ORGANIZATION_ID,
        search: params.search,
        status: params.status,
        offset: params.offset,
        limit: params.limit ?? 9999,
        orderBy: params.orderBy,
      },
      { validator: brandListResultSchema }
    );
    return result.records;
  }
}

export const brandsApi = new BrandsApi();
