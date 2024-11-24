const UserPermissionsEnum = {
  CREATE_USER: "CREATE_USER",
  LIST_USERS: "LIST_USERS",
  VIEW_USER: "VIEW_USER",
  UPDATE_USER: "UPDATE_USER",
  DELETE_USER: "DELETE_USER",
  UPDATE_USER_ROLE: "UPDATE_USER_ROLE",
};
const RolePermissionsEnum = {
  CREATE_ROLE: "CREATE_ROLE",
  UPDATE_ROLE: "UPDATE_ROLE",
  VIEW_ROLE: "VIEW_ROLE",
  VIEW_PERMISSION: "VIEW_PERMISSION",
};

const FormPermissionsEnum = {
  CREATE_FORM: "CREATE_FORM",
  UPDATE_FORM: "UPDATE_FORM",
  VIEW_FORM: "VIEW_FORM",
  DELETE_FORM: "DELETE_FORM",
};

const ProjectPermissionsEnum = {
  VIEW_PROJECT: "VIEW_PROJECT",
  CREATE_PROJECT: "CREATE_PROJECT",
  UPDATE_PROJECT: "UPDATE_PROJECT",
  DELETE_PROJECT: "DELETE_PROJECT",
};

export const PermissionsEnum = {
  ...UserPermissionsEnum,
  ...RolePermissionsEnum,
  ...FormPermissionsEnum,
  ...ProjectPermissionsEnum,
  INVITE_USERS: "INVITE_USERS",
  VIEW_CONFIGS: "VIEW_CONFIGS",
  INTEGRATE_ORGANIZATION: "INTEGRATE_ORGANIZATION",
};
export type PermissionsEnum = typeof PermissionsEnum;

export const permissionTranslations: Record<string, string> = {
  [PermissionsEnum.CREATE_USER]: "Criar Usuário",
  [PermissionsEnum.LIST_USERS]: "Listar Usuários",
  [PermissionsEnum.VIEW_USER]: "Visualizar Usuário",
  [PermissionsEnum.UPDATE_USER]: "Atualizar Usuário",
  [PermissionsEnum.DELETE_USER]: "Excluir Usuário",
  [PermissionsEnum.UPDATE_USER_ROLE]: "Atualizar Cargo do Usuário",

  [PermissionsEnum.CREATE_ROLE]: "Criar Cargo",
  [PermissionsEnum.VIEW_ROLE]: "Visualizar Cargo",
  [PermissionsEnum.UPDATE_ROLE]: "Atualizar Cargo",
  [PermissionsEnum.VIEW_PERMISSION]: "Visualizar Permissão",

  [PermissionsEnum.VIEW_FORM]: "Visualizar Formulário",
  [PermissionsEnum.CREATE_FORM]: "Criar Formulário",
  [PermissionsEnum.UPDATE_FORM]: "Atualizar Formulário",
  [PermissionsEnum.DELETE_FORM]: "Excluir Formulário",

  [PermissionsEnum.VIEW_PROJECT]: "Visualizar Projeto",
  [PermissionsEnum.CREATE_PROJECT]: "Criar Projeto",
  [PermissionsEnum.UPDATE_PROJECT]: "Atualizar Projeto",
  [PermissionsEnum.DELETE_PROJECT]: "Excluir Projeto",

  [PermissionsEnum.INVITE_USERS]: "Convidar Usuários",
  [PermissionsEnum.VIEW_CONFIGS]: "Visualizar Configurações",
};

export const categoryTranslations: Record<string, string> = {
  CREATE: "Criação",
  LIST: "Listagem",
  VIEW: "Visualização",
  UPDATE: "Atualização",
  DELETE: "Exclusão",
  INVITE: "Convite",
  INTEGRATE: "Integração",
};
