import { BaseApi } from "./http/baseApi";
import { ENDPOINTS } from "./config/endpoints";
import type { PageConfigData, PageKey } from "./types";
import { pageConfigDataSchema } from "./schemas/pageConfig";

class PageConfigApi extends BaseApi {
  constructor() {
    super(ENDPOINTS.stores);
  }

  fetchConfig(storeId: string, page: PageKey): Promise<PageConfigData> {
    return this.get<PageConfigData>(`/${storeId}/pages/${page}`, undefined, {
      validator: pageConfigDataSchema,
    });
  }

  async saveConfig(storeId: string, page: PageKey, data: PageConfigData): Promise<void> {
    await this.post(`/${storeId}/pages/${page}`, data);
  }
}

export const pageConfigApi = new PageConfigApi();
