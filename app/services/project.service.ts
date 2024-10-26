import api from "./client";
import { FindPaginated } from "../interfaces/common/findPaginated";
import { FilterInterface } from "../interfaces/common/filter";
import { ProjectInterface } from "../interfaces/project/project.interface";

export interface ProjectService {
  create: (dto: { name: string; users: string[] }) => Promise<void>;
  update: (id: string, dto: { name: string; users: string[] }) => Promise<void>;
  getAll: (filter: FilterInterface) => Promise<FindPaginated<ProjectInterface>>;
  toggleActive: (id: string) => Promise<void>;
  getProjectById: (id: string) => Promise<ProjectInterface>;
}

const basePath = "/project";

export const projectService: ProjectService = {
  create: async (dto) => {
    try {
      await api.post(basePath, dto);
    } catch (error) {
      throw error;
    }
  },
  getAll: async (filter): Promise<FindPaginated<ProjectInterface>> => {
    try {
      const response = await api.get(basePath, { params: { ...filter } });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  toggleActive: async (id: string) => {
    try {
      await api.put(basePath + `/${id}/toggle-active`);
    } catch (error) {
      throw error;
    }
  },
  getProjectById: async (id: string) => {
    try {
      const response = await api.get(basePath + `/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  update: async (id, dto) => {
    try {
      await api.put(basePath + `/${id}`, dto);
    } catch (error) {
      throw error;
    }
  },
};
