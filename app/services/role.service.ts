import api from "./client";
import { FilterInterface } from "../interfaces/common/filter";
import { FindPaginated } from "../interfaces/common/findPaginated";
import { Role } from "../interfaces/role/role.interface";

export interface RoleService {
  getAll: (filter: FilterInterface) => Promise<FindPaginated<Role>>;
  getByName: (name: string) => Promise<Role>;
  getAllPermissions: () => Promise<Record<string,string>>
  updateRole: (id:string, data:string[]) => Promise<void>
  createRole: (data: {permissions: string[], name: string}) => Promise<void>
}

const basePath = "/roles";

export const roleService: RoleService = {
  getAll: async (filter) => {
    try {
      const response = await api.get<FindPaginated<Role>>(basePath, { params: { ...filter } });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getByName: async (name) => {
    try {
      const response = await api.get<Role>(basePath + `/find-by-name/${name}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getAllPermissions: async () => {
    try {
      const response = await api.get<Record<string, string>>(basePath + `/permissions`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateRole: async (id: string, data: string[]): Promise<void> => {
    try {
      await api.patch(basePath + `/${id}`, { permissions: data });
    } catch (error) {
      throw error;
    }
  },
  createRole: async (data): Promise<void> => {
    try {
      await api.post(basePath, data);
    } catch (error) {
      throw error;
    }
  }
};
