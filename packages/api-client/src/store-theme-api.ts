import { BaseApi } from "./http/baseApi";
import { ENDPOINTS } from "./config/endpoints";
import type { StoreTheme } from "./types";
import { storeThemeSchema } from "./schemas/storeTheme";

export const NEUTRAL_THEME: StoreTheme = {
  storeId: "",
  colors: { primary: "#2563eb", background: "#ffffff", text: "#111111", textMuted: "#666666" },
  fonts: { heading: "inherit", body: "inherit" },
};

class StoreThemeApi extends BaseApi {
  constructor() {
    super(ENDPOINTS.stores);
  }

  fetchTheme(storeId: string): Promise<StoreTheme> {
    return this.get<StoreTheme>(`/${storeId}/theme`, undefined, { validator: storeThemeSchema });
  }

  async saveTheme(storeId: string, theme: StoreTheme): Promise<void> {
    await this.post(`/${storeId}/theme`, theme);
  }
}

export const storeThemeApi = new StoreThemeApi();
