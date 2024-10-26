import api from "./client";
import { FilterInterface } from "../interfaces/common/filter";
import { FindPaginated } from "../interfaces/common/findPaginated";
import { User } from "../interfaces/user/user.interface";

export interface UserService {
  getAll: (filter:FilterInterface) => Promise<FindPaginated<User>>;
}

const basePath = "/users";

export const userService: UserService = {
  getAll: async (filter) => {
    try {
      const response = await api.get(basePath, { params: {...filter} });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
