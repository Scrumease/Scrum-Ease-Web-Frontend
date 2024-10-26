import { Role } from "../role/role.interface";
import { Tenant } from "../tenant/tenant.interface";

export interface TenantRole {
  tenant: Tenant;
  role: Role;
  _id: string;
}
