import { useState } from "react";
import { apiClient } from "@/lib/api-client";

type UploadedImage = {
  url: string;
  publicId?: string;
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
};

type SingleUploadResponse = UploadedImage;

type MultiUploadResponse = {
  images: UploadedImage[];
};

type VideoUploadResponse = {
  url: string;
};

type UseUploadResult = {
  url: string | null;
  urls: string[];
  isUploading: boolean;
  error: string | null;
  upload: (file: File, folder?: string) => Promise<string>;
  uploadMany: (files: File[], folder?: string) => Promise<string[]>;
  uploadVideo: (file: File, folder?: string) => Promise<string>;
  reset: () => void;
};

export function useUpload(): UseUploadResult {
  const [url, setUrl] = useState<string | null>(null);
  const [urls, setUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File, folder?: string): Promise<string> => {
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", file);
      if (folder) {
        formData.append("folder", folder);
      }

      const response = await apiClient.post<SingleUploadResponse>(
        "/api/upload/image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setUrl(response.url);
      return response.url;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to upload image.";
      setError(message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const uploadMany = async (
    files: File[],
    folder?: string,
  ): Promise<string[]> => {
    if (!files.length) return [];

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("images", file);
      });
      if (folder) {
        formData.append("folder", folder);
      }

      const response = await apiClient.post<MultiUploadResponse>(
        "/api/upload/images",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const uploadedUrls = response.images.map((image) => image.url);
      setUrls(uploadedUrls);
      return uploadedUrls;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to upload images.";
      setError(message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const uploadVideo = async (file: File, folder?: string): Promise<string> => {
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("video", file);
      if (folder) {
        formData.append("folder", folder);
      }

      const response = await apiClient.post<VideoUploadResponse>(
        "/api/upload/video",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setUrl(response.url);
      return response.url;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to upload video.";
      setError(message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const reset = () => {
    setUrl(null);
    setUrls([]);
    setError(null);
  };

  return {
    url,
    urls,
    isUploading,
    error,
    upload,
    uploadMany,
    uploadVideo,
    reset,
  };
}

