export enum UserRole {
  HOST = 'host',
  CO_HOST = 'co_host',
  COLLABORATOR = 'collaborator',
  SUPER_ADMIN = 'super_admin',
  SUPPORT = 'support'
}

export const ROLE_PERMISSIONS = {
  [UserRole.HOST]: {
    canEdit: true,
    canPublish: true,
    canDelete: true,
    canManageBilling: true,
    canViewRSVP: true
  },
  [UserRole.CO_HOST]: {
    canEdit: true,
    canPublish: false,
    canDelete: false,
    canManageBilling: false,
    canViewRSVP: true
  },
  [UserRole.COLLABORATOR]: {
    canEdit: false,
    canPublish: false,
    canDelete: false,
    canManageBilling: false,
    canViewRSVP: true
  },
  [UserRole.SUPER_ADMIN]: {
    canEdit: true,
    canPublish: true,
    canDelete: true,
    canManageBilling: true,
    canViewRSVP: true,
    canManageUsers: true
  },
  [UserRole.SUPPORT]: {
    canEdit: false,
    canPublish: false,
    canDelete: false,
    canManageBilling: false,
    canViewRSVP: true,
    canImpersonate: true
  }
}

export const DEFAULT_ROLE = UserRole.HOST
