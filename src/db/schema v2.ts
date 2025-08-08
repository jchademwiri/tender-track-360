// src/db/schema.ts
// Re-export all schema components from their respective modules
export * from './schema/enums';
export * from './schema/users';
export * from './schema/user-profiles';
export * from './schema/clients';
export * from './schema/categories';
export * from './schema/tenders';
export * from './schema/documents';
export * from './schema/tasks';
export * from './schema/reminders';
export * from './schema/notifications';
export * from './schema/activity-logs';
export * from './schema/status-transitions';

// Better Auth tables will be auto-generated:
// - user
// - organization
// - member
// - session
// - account
// - verification
// - invitation
