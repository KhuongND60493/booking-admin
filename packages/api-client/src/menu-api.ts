import { BaseApi } from "./http/baseApi";
import { ENDPOINTS } from "./config/endpoints";
import { menuItemListSchema } from "./schemas/menuItem";

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
}

class MenuApi extends BaseApi {
  constructor() {
    super(ENDPOINTS.menu);
  }

  list(): Promise<MenuItem[]> {
    return this.get<MenuItem[]>("", undefined, { validator: menuItemListSchema });
  }
}

export const menuApi = new MenuApi();
