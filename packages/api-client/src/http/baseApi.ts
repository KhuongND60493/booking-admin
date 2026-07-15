import type { ZodType } from "zod";
import { apiClient } from "./request";
import type { EndpointDefinition } from "../config/endpoints";

export interface DoOptions<T> {
  validator?: ZodType<T>;
}

export class BaseApi {
  protected endpoint: EndpointDefinition;

  constructor(endpoint: EndpointDefinition) {
    this.endpoint = endpoint;
  }

  private unwrap(data: unknown): unknown {
    if (data && typeof data === "object" && "success" in data && "data" in data) {
      return (data as { data: unknown }).data;
    }
    return data;
  }

  private parse<T>(data: unknown, validator?: ZodType<T>): T {
    const unwrapped = this.unwrap(data);
    if (!validator) return unwrapped as T;
    try {
      return validator.parse(unwrapped);
    } catch (err) {
      console.error(`[BaseApi] response validation failed for ${this.endpoint.base}`, err);
      throw err;
    }
  }

  protected async get<T>(path: string, params?: Record<string, unknown>, opts?: DoOptions<T>): Promise<T> {
    const res = await apiClient.get(`${this.endpoint.base}${path}`, { params });
    return this.parse(res.data, opts?.validator);
  }

  protected async post<T>(
    path: string,
    body?: unknown,
    opts?: DoOptions<T> & { params?: Record<string, unknown> },
  ): Promise<T> {
    const res = await apiClient.post(`${this.endpoint.base}${path}`, body, { params: opts?.params });
    return this.parse(res.data, opts?.validator);
  }

  protected async put<T>(
    path: string,
    body?: unknown,
    opts?: DoOptions<T> & { params?: Record<string, unknown> },
  ): Promise<T> {
    const res = await apiClient.put(`${this.endpoint.base}${path}`, body, { params: opts?.params });
    return this.parse(res.data, opts?.validator);
  }

  protected async patch<T>(path: string, body?: unknown, opts?: DoOptions<T>): Promise<T> {
    const res = await apiClient.patch(`${this.endpoint.base}${path}`, body);
    return this.parse(res.data, opts?.validator);
  }

  protected async delete<T>(path: string, params?: Record<string, unknown>, opts?: DoOptions<T>): Promise<T> {
    const res = await apiClient.delete(`${this.endpoint.base}${path}`, { params });
    return this.parse(res.data, opts?.validator);
  }

  protected async deleteWithBody<T>(path: string, body: unknown, opts?: DoOptions<T>): Promise<T> {
    const res = await apiClient.delete(`${this.endpoint.base}${path}`, { data: body });
    return this.parse(res.data, opts?.validator);
  }
}
