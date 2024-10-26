export interface RegisterAdmin {
  tenantName: string;
  tenantIdentifier: string;
  adminName: string;
  adminEmail: string;
  password: string;
  country: string;
  state: string;
  city: string;
  timezone: {
    value: string;
    offset?: number | undefined;
  };
}
