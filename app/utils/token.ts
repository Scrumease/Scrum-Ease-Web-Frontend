import { JwtPayload, jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

export interface DecodedToken extends JwtPayload {
  currentTenant: {tenantId: string, role: Role};
  email: string;
  name: string;
}

interface Role {
    _id: string;
    name: string;
    permissions: string[];
    tenantId: string;
}

export const getUserInfoFromToken = () => {
  const token = Cookies.get("accessToken");
  if (token) {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      return decoded;
    } catch (error) {
      console.error("Erro ao decodificar token JWT:", error);
      return null;
    }
  }
  return null;
};
