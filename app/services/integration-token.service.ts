import api from "./client";

export interface IntegrationTokenService {
  generateToken: () => Promise<string>;
}

const basePath = "/integration-token";

export const integrationTokenService: IntegrationTokenService = {
  generateToken: async () => {
    try {
      const response = await api.post(basePath + "/generate-token");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
