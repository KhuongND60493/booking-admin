import { apiClient } from "./http/request";
import { ENDPOINTS } from "./config/endpoints";

interface UploadPictureResponse {
  success: boolean;
  data: number[];
}

class PicturesApi {
  async upload(file: File): Promise<number> {
    const formData = new FormData();
    formData.append("files", file);
    const res = await apiClient.post<UploadPictureResponse>(ENDPOINTS.pictures.base, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data[0];
  }
}

export const picturesApi = new PicturesApi();
