export interface RegisterAdmin {
  tenantName: string;
  tenantIdentifier: string;
  adminName: string;
  adminEmail: string;
  password: string;
  timezone: {
    value: string;
    offset?: number | undefined;
  };
}
