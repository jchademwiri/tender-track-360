// Role definitions and utilities for Tender Track 360

export type UserRole =
  | 'admin'
  | 'tender_manager'
  | 'tender_specialist'
  | 'viewer';

// Better Auth role definitions (matches auth.ts configuration)
export const BETTER_AUTH_ROLES = {
  admin: {
    name: 'Admin',
    description: 'Full system access with administrative privileges',
  },
  tender_manager: {
    name: 'Tender Manager',
    description: 'Manage tenders, team members, and organizational settings',
  },
  tender_specialist: {
    name: 'Tender Specialist',
    description: 'Create, edit, and manage tender processes',
  },
  viewer: {
    name: 'Viewer',
    description: 'Read-only access to view tenders and reports',
  },
} as const;

export interface RoleDefinition {
  id: UserRole;
  name: string;
  description: string;
  permissions: string[];
  level: number; // Higher number = more permissions
}

export const ROLES: Record<UserRole, RoleDefinition> = {
  admin: {
    id: 'admin',
    name: 'Admin',
    description: 'Full system access with administrative privileges',
    permissions: [
      'manage_organization',
      'manage_users',
      'manage_tenders',
      'view_all_data',
      'system_settings',
      'invite_members',
      'remove_members',
      'change_member_roles',
    ],
    level: 4,
  },
  tender_manager: {
    id: 'tender_manager',
    name: 'Tender Manager',
    description: 'Manage tenders, team members, and organizational settings',
    permissions: [
      'manage_tenders',
      'view_all_tenders',
      'assign_tasks',
      'manage_team',
      'invite_members',
      'view_reports',
      'manage_categories',
      'manage_clients',
    ],
    level: 3,
  },
  tender_specialist: {
    id: 'tender_specialist',
    name: 'Tender Specialist',
    description: 'Create, edit, and manage tender processes',
    permissions: [
      'create_tenders',
      'edit_own_tenders',
      'manage_documents',
      'view_assigned_tenders',
      'update_tender_status',
      'manage_tasks',
      'view_basic_reports',
    ],
    level: 2,
  },
  viewer: {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access to view tenders and reports',
    permissions: [
      'view_tenders',
      'view_documents',
      'view_basic_reports',
      'view_own_tasks',
    ],
    level: 1,
  },
};

// Utility functions for role management
export function getRoleDefinition(role: UserRole): RoleDefinition {
  return ROLES[role];
}

export function getRoleName(role: UserRole): string {
  return ROLES[role].name;
}

export function getRoleDescription(role: UserRole): string {
  return ROLES[role].description;
}

export function hasPermission(userRole: UserRole, permission: string): boolean {
  return ROLES[userRole].permissions.includes(permission);
}

export function hasMinimumRole(
  userRole: UserRole,
  requiredRole: UserRole
): boolean {
  return ROLES[userRole].level >= ROLES[requiredRole].level;
}

export function canManageRole(
  managerRole: UserRole,
  targetRole: UserRole
): boolean {
  // Admins can manage all roles
  if (managerRole === 'admin') return true;

  // Tender managers can manage specialists and viewers
  if (managerRole === 'tender_manager') {
    return targetRole === 'tender_specialist' || targetRole === 'viewer';
  }

  // Others cannot manage roles
  return false;
}

export function getAvailableRoles(userRole: UserRole): UserRole[] {
  switch (userRole) {
    case 'admin':
      return ['admin', 'tender_manager', 'tender_specialist', 'viewer'];
    case 'tender_manager':
      return ['tender_specialist', 'viewer'];
    default:
      return [];
  }
}

export function getRoleColor(role: UserRole): string {
  switch (role) {
    case 'admin':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'tender_manager':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'tender_specialist':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'viewer':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

// Role hierarchy for easy comparison
export const ROLE_HIERARCHY: UserRole[] = [
  'viewer',
  'tender_specialist',
  'tender_manager',
  'admin',
];

export function isHigherRole(role1: UserRole, role2: UserRole): boolean {
  const index1 = ROLE_HIERARCHY.indexOf(role1);
  const index2 = ROLE_HIERARCHY.indexOf(role2);
  return index1 > index2;
}
