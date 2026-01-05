import { apiClient } from "@/lib/api-client";
import type {
  Class,
  ClassTemplate,
  CreateClassPayload,
  UpdateClassPayload,
  CreateTemplatePayload,
  UseTemplatePayload,
  AssignTrainerPayload,
  ReuseClassPayload,
  ClassReport,
} from "../types";

const classesPath = "/api/classes";

export const classesApi = {
  getClasses: (locationId?: string): Promise<Class[]> => {
    const params = locationId ? { locationId } : {};
    return apiClient.get<Class[]>(classesPath, { params });
  },
  getClassById: (id: string): Promise<Class> =>
    apiClient.get<Class>(`${classesPath}/${id}`),
  createClass: (payload: CreateClassPayload): Promise<Class> =>
    apiClient.post<Class>(classesPath, payload),
  updateClass: (id: string, payload: UpdateClassPayload): Promise<Class> =>
    apiClient.put<Class>(`${classesPath}/${id}`, payload),
  deleteClass: (id: string): Promise<void> =>
    apiClient.delete<void>(`${classesPath}/${id}`),
  assignTrainer: (
    id: string,
    payload: AssignTrainerPayload
  ): Promise<Class> =>
    apiClient.post<Class>(`${classesPath}/${id}/assign-trainer`, payload),
  reuseClass: (id: string, payload: ReuseClassPayload): Promise<Class> =>
    apiClient.post<Class>(`${classesPath}/${id}/reuse`, payload),
  getClassReport: (id: string): Promise<ClassReport> =>
    apiClient.get<ClassReport>(`${classesPath}/${id}/report`),
  getTemplates: (): Promise<ClassTemplate[]> =>
    apiClient.get<ClassTemplate[]>(`${classesPath}/templates`),
  createTemplate: (payload: CreateTemplatePayload): Promise<ClassTemplate> =>
    apiClient.post<ClassTemplate>(`${classesPath}/templates`, payload),
  useTemplate: (payload: UseTemplatePayload): Promise<Class> =>
    apiClient.post<Class>(`${classesPath}/use-template`, payload),
};
