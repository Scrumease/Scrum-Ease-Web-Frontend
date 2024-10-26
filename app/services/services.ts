import { AuthService, authService } from "./auth.service";
import { DailyService, dailyService } from "./daily.service";
import { FormService, formService } from "./form.service";
import { IntegrationTokenService, integrationTokenService } from "./integration-token.service";
import { MailService, mailService } from "./mail.service";
import { ProjectService, projectService } from "./project.service";
import { RoleService, roleService } from "./role.service";
import { UserService, userService } from "./user.service";

export interface Services {
  authService: AuthService;
  mailService: MailService;
  userService: UserService;
  roleService: RoleService;
  dailyService: DailyService;
  integrationTokenService: IntegrationTokenService;
  projectService: ProjectService
  formService: FormService;
}

export const services: Services = {
  authService: authService,
  mailService: mailService,
  userService: userService,
  roleService: roleService,
  dailyService: dailyService,
  integrationTokenService: integrationTokenService,
  projectService: projectService,
  formService: formService,
};
