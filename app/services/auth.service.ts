import Cookies from "js-cookie";
import { LoginInterface } from "../interfaces/auth/login";
import api from "./client";
import { RegisterAdmin } from "../interfaces/auth/registerAdmin";
import axios from "axios";
import { CheckInviteToken } from "../interfaces/auth/checkInviteToken";
import { CompleteRegistrationFormValues } from "../invite/form";

export interface AuthService {
  login: (dto: LoginInterface) => Promise<void>;
  register: (dto: RegisterAdmin) => Promise<void>;
  logout: () => Promise<void>;
  checkInviteToken: (dto: CheckInviteToken) => Promise<{valid: boolean, newUser: boolean}>;
  completeRegistration: (data: CompleteRegistrationFormValues, params: {tenantId: string}) => Promise<void>;
  completeRegistrationRegisteredUser(params: {tenantId: string, email: string}): Promise<void>;
}

const basePath = "/auth";

export const authService: AuthService = {
  login: async (dto) => {
    try {
      const response = await api.post(basePath + "/login", { ...dto });
      Cookies.set("accessToken", response.data.accessToken);
      Cookies.set("refreshToken", response.data.refreshToken);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  register: async (dto) => {
    try {
      await api.post(basePath + "/register-admin", { ...dto });
    } catch (error) {
      throw error;
    }
  },
  logout: async () => {
    try {
      const api = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + Cookies.get("refreshToken"),
        },
      });
      await api.post(basePath + "/logout");
      Cookies.remove("token");
      Cookies.remove("refreshToken");
    } catch (error) {
      throw error;
    }
  },
  checkInviteToken: async (dto) => {
    try {
      const response = await api.post<{valid: boolean, newUser: boolean}>(basePath + "/verify-invite-token", { verifyDto: dto });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  completeRegistration: async (data: CompleteRegistrationFormValues, params): Promise<void> => {
    try {
      await api.post(basePath + `/register-by-invite/${params.tenantId}`, { ...data });
    } catch (error) {
      throw error;
    }
  },
  completeRegistrationRegisteredUser: async (params): Promise<void> => {
    try {
      await api.post(basePath + `/register-by-invite/${params.tenantId}/${params.email}`);
    } catch (error) {
      throw error;
    }
  },
};
