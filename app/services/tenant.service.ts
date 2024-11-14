import api from "./client";
import { FindAllTenantsResponseDto } from "../interfaces/tenant/FindAllTenantsResponseDto";
import Cookies from "js-cookie";

export interface TenantService {
  findAll: () => Promise<FindAllTenantsResponseDto[]>;
  leave: (id: string) => Promise<void>;
  create: (createDto: { name: string; identifier: string }) => Promise<void>;
}

const basePath = "/tenants";

export const tenantService: TenantService = {
  findAll: async () => {
    const response = await api.get(basePath + "/me");
    return response.data;
  },
  leave: async (id) => {
    const response = await api.delete<{
      accessToken: string;
      refreshToken: string;
    }>(basePath + "/" + id + "/leave");

    Cookies.set("accessToken", response.data.accessToken);
    Cookies.set("refreshToken", response.data.refreshToken);
  },
  create: async (createDto) => {
    const response = await api.post(basePath, createDto);
  },
};
