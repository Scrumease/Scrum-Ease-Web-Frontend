import { BaseDocument } from "../common/base.document";
import { RoleDocument } from "../role/role.document";
import { TenantDocument } from "../tenant/tenant.document";

export type UserDocument = {
    name: string
    email: string
    password: string
    country: string
    state: string
    city: string
    timezone: {
        value: string
        offset: number
    }
    tenantRoles: {
        tenant: string | TenantDocument
        role: string | RoleDocument
    } []
} & BaseDocument;