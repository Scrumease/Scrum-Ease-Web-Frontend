import { Tenant } from "../tenant/tenant.interface";
import { User } from "../user/user.interface";

export interface ProjectInterface {
    _id: string;
    name: string;
    tenantId: string | Tenant;
    users: string[] | User[];
    isActive: boolean;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}