import { AuthService, authService } from "./auth.service";
import { DailyService, dailyService } from "./daily.service";
import { FormService, formService } from "./form.service";
import {
  IntegrationTokenService,
  integrationTokenService,
} from "./integration-token.service";
import { MailService, mailService } from "./mail.service";
import { ProjectService, projectService } from "./project.service";
import { RoleService, roleService } from "./role.service";
import { TenantService, tenantService } from "./tenant.service";
import { UserService, userService } from "./user.service";

export interface Services {
  authService: AuthService;
  mailService: MailService;
  userService: UserService;
  roleService: RoleService;
  dailyService: DailyService;
  integrationTokenService: IntegrationTokenService;
  projectService: ProjectService;
  formService: FormService;
  tenantService: TenantService;
}

export const services: Services = {
  authService,
  mailService,
  userService,
  roleService,
  dailyService,
  integrationTokenService,
  projectService,
  formService,
  tenantService,
};
