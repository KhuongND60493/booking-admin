import { z } from "zod";
import { BaseApi } from "./http/baseApi";
import { ENDPOINTS } from "./config/endpoints";

const verifyResultSchema = z.object({ valid: z.boolean() });

class OtpApi extends BaseApi {
  constructor() {
    super(ENDPOINTS.otp);
  }

  async send(phone: string): Promise<void> {
    await this.post("/send", { phone });
  }

  async verify(phone: string, code: string): Promise<boolean> {
    const result = await this.post("/verify", { phone, code }, { validator: verifyResultSchema });
    return result.valid;
  }
}

export const otpApi = new OtpApi();
