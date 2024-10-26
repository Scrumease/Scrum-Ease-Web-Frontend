enum UserPermissionsEnum {
  CREATE_USER = "CREATE_USER",
  LIST_USERS = "LIST_USERS",
  VIEW_USER = "VIEW_USER",
  UPDATE_USER = "UPDATE_USER",
  DELETE_USER = "DELETE_USER",
}
enum RolePermissionsEnum {
  CREATE_ROLE = "CREATE_ROLE",
  UPDATE_ROLE = "UPDATE_ROLE",
  VIEW_ROLE = "VIEW_ROLE",
  VIEW_PERMISSION = "VIEW_PERMISSION",
}

enum FormPermissionsEnum {
  CREATE_FORM = "CREATE_FORM",
  UPDATE_FORM = "UPDATE_FORM",
  VIEW_FORM = "VIEW_FORM",
  DELETE_FORM = "DELETE_FORM",
}

enum ProjectPermissionsEnum {
  VIEW_PROJECT = "VIEW_PROJECT",
  CREATE_PROJECT = "CREATE_PROJECT",
  UPDATE_PROJECT = "UPDATE_PROJECT",
  DELETE_PROJECT = "DELETE_PROJECT",
}

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
