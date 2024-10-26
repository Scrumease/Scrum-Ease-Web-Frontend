import { TenantRole } from "../tenantRole/tenantRole.interface";

export interface User {
  _id: string;
  name: string;
  email: string;
  tenantRoles: TenantRole[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
