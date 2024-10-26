import { BaseDocument } from "../common/base.document";
import { TenantDocument } from "../tenant/tenant.document";
import { UserDocument } from "../user/user.document";

export type ProjectDocument = {
  name: string;
  isActive: boolean;
  description?: string;
  tenantId: string | TenantDocument;
  users: (string | UserDocument)[];
} & BaseDocument;
