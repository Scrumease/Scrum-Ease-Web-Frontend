import api from "./client";
import { FilterInterface } from "../interfaces/common/filter";
import { FindPaginated } from "../interfaces/common/findPaginated";
import { User } from "../interfaces/user/user.interface";
import { UserDocument } from "../interfaces/user/user.document";

export interface UserService {
  getAll: (filter: FilterInterface) => Promise<FindPaginated<User>>;
  me(): Promise<UserDocument>;
  update(data: {
    name: string;
    timezone: { value: string; offset: number };
  }): Promise<void>;
}

const basePath = "/users";

export const userService: UserService = {
  getAll: async (filter) => {
    try {
      const response = await api.get(basePath, { params: { ...filter } });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  me: async () => {
    const response = await api.get(basePath + "/me");
    return response.data;
  },
  update: async (data) => {
    await api.put(basePath + "/me", data);
  },
};
