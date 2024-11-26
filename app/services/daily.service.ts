import { AnwserDailyDto } from "../interfaces/daily/anwser.dto";
import { DailyDocument } from "../interfaces/daily/daily.document";
import { ProjectDocument } from "../interfaces/project/project.document";
import api from "./client";

export interface DailyService {
  anwserDaily: (dto: AnwserDailyDto) => Promise<void>;
  getEntries: (userId: string, days: number) => Promise<any>;
  checkOrCreateDaily: (
    formId: string
  ) => Promise<{
    today: DailyDocument;
    yesterday: DailyDocument;
    project: ProjectDocument;
  }>;
  getResponses: (
    formId: string,
    {
      filterUserId,
      startDate,
      endDate,
    }: { filterUserId?: string; startDate?: string; endDate?: string }
  ) => Promise<any>;
}

const basePath = "/daily";

export const dailyService: DailyService = {
  anwserDaily: async (dto) => {
    try {
      await api.post(basePath + `/anwser`, dto);
    } catch (error) {
      throw error;
    }
  },
  getEntries: async (userId: string, days: number): Promise<any> => {
    try {
      const result = await api.get(basePath + `?user=${userId}&days=${days}`);
      return result;
    } catch (error) {
      throw error;
    }
  },
  checkOrCreateDaily: async (formId: string) => {
    return (await api.post(basePath + `/${formId}/checkOrCreateDaily`)).data;
  },
  getResponses: async (
    formId: string,
    {
      filterUserId,
      startDate,
      endDate,
    }: { filterUserId?: string; startDate?: string; endDate?: string }
  ): Promise<any> => {
    return await api.get(basePath + `/${formId}/responses`, {
      params: {
        userId: filterUserId,
        startDate,
        endDate,
      },
    });
  },
};
