import api from "./client";

export interface MailService {
  invite: (dto: {tos: string[], roleName: string}) => Promise<void>;
}

const basePath = "/mail";

export const mailService: MailService = {
  invite: async (dto) => {
    try {
      const response = await api.post(basePath + "/invite", { ...dto });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
