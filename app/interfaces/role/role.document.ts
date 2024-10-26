import { PermissionsEnum } from "@/app/enums/permissions.enum";
import { BaseDocument } from "../common/base.document";
import { TenantDocument } from "../tenant/tenant.document";

export type RoleDocument = {
    name: string;
    permissions: PermissionsEnum[];
    tenantId: string | TenantDocument;
} & BaseDocument;