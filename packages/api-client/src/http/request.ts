import axios from "axios";
import { ApiError } from "./apiError";

export const BASE_URL = process.env.NEXT_PUBLIC_BE_API_URL ?? "";

function handleErrorResponse(error: unknown): never {
  if (axios.isAxiosError(error)) {
    if (error.code === "ECONNABORTED" || error.message === "Network Error") {
      throw new ApiError("Network timeout, please try again", { errorCode: "NETWORK_ERROR" });
    }
    const status = error.response?.status;
    const data = error.response?.data as { message?: string; error?: number } | undefined;
    throw new ApiError(data?.message ?? error.message, { status, errorNumber: data?.error });
  }
  throw error instanceof Error ? error : new Error(String(error));
}

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
});

apiClient.interceptors.request.use((config) => {
  config.params = { lang: config.params?.lang, ...config.params };
  // TODO: gắn Authorization: `Bearer ${token}` khi có auth thật (Keycloak/session).
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    const body = response.data;
    if (body && typeof body === "object" && body.success === false) {
      throw new ApiError(body.message ?? "Request failed", { errorNumber: body.error });
    }
    return response;
  },
  (error) => handleErrorResponse(error)
);
