import { BaseDocument } from "../common/base.document";

export type TenantDocument = {
    name: string;
    identifier: string;
    adminId: string;
} & BaseDocument;