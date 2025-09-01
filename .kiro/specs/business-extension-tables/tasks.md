# Business Extension Tables - Implementation Tasks

- [ ] 1. Create database schema foundation for business extensions
  - Add business role enum (admin, tender_manager, tender_specialist, viewer) to schema
  - Create user_profiles table with proper foreign keys to Better Auth tables
  - Add comprehensive indexes for organization, role, and status queries
  - Set up unique constraints for one profile per user per organization
  - _Requirements: 1.1, 1.2, 1.4, 8.1, 8.2_

- [ ] 2. Implement user preferences table with notification controls
  - Create user_preferences table with JSON fields for flexible settings
  - Add notification settings structure for granular control (deadlines, status, tasks, documents, extensions, alerts)
  - Implement dashboard customization fields (view type, widget order, compact mode)
  - Set up regional preferences (timezone, language, date/time formats)
  - Add support for both global and organization-specific preferences
  - _Requirements: 4.1, 4.2, 4.4, 5.1, 5.2_

- [ ] 3. Create TypeScript interfaces and type definitions
  - Define UserProfile and UserPreferences types with proper inference
  - Create NotificationSettings and DashboardSettings interfaces
  - Build UserContext type combining user, profile, preferences, and permissions
  - Add validation schemas using Zod for runtime type checking
  - Export all types for use across the application
  - _Requirements: 1.3, 4.3, 8.3_

- [ ] 4. Implement database relations and query helpers
  - Set up Drizzle relations between user_profiles and Better Auth tables
  - Create relations for user_preferences with proper organization scoping
  - Add audit trail relations (createdBy, updatedBy, deletedBy)
  - Implement efficient join queries for loading complete user context
  - _Requirements: 1.1, 6.4, 7.4, 8.2_

- [ ] 5. Build UserProfileService for profile management
  - Implement createProfile method with validation and audit logging
  - Add updateProfile method with permission checks and change tracking
  - Create soft delete functionality preserving audit trail
  - Build getUserContext method combining profile, preferences, and permissions
  - Add updateLastLogin and completeOnboarding helper methods
  - _Requirements: 1.1, 1.4, 2.4, 3.1, 3.2, 7.1, 7.2_

- [ ] 6. Build UserPreferencesService for preference management
  - Implement createDefaultPreferences with organization inheritance
  - Add updatePreferences method with validation and immediate application
  - Create getEffectivePreferences method handling global vs org-specific precedence
  - Build specialized methods for notification and dashboard settings updates
  - Add preference validation and sanitization
  - _Requirements: 4.1, 4.4, 5.3, 5.4, 6.3_

- [ ] 7. Implement multi-organization profile support
  - Add logic for handling users with multiple organization memberships
  - Create organization switching functionality with proper context loading
  - Implement separate business roles per organization
  - Add organization-specific preference overrides
  - Build profile isolation ensuring users only see profiles within their organizations
  - _Requirements: 6.1, 6.2, 6.4, 6.5_

- [ ] 8. Create profile and preference API endpoints
  - Build GET /api/profile endpoint for current user profile and preferences
  - Add PUT /api/profile endpoint for profile updates with validation
  - Create PATCH /api/preferences endpoints for notification and dashboard settings
  - Implement GET /api/users/profiles for organization user management (admin only)
  - Add proper error handling and validation for all endpoints
  - _Requirements: 1.3, 2.1, 4.3, 5.4_

- [ ] 9. Implement audit logging and change tracking
  - Create activity logging for all profile and preference changes
  - Add role change tracking with previous/new role and reason
  - Implement comprehensive audit trail for compliance requirements
  - Build efficient audit query methods with proper indexing
  - Add data retention policy support for audit logs
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 10. Build authentication middleware integration
  - Update auth middleware to load user context (profile + preferences + permissions)
  - Add business role checking utilities for route protection
  - Implement organization context switching in session management
  - Create permission checking helpers based on business roles
  - Add automatic profile creation on first organization join
  - _Requirements: 1.1, 2.3, 6.2, 8.4_

- [ ] 11. Create database migrations and seeding
  - Write Drizzle migration files for new tables and indexes
  - Create seed data for default business roles and permissions
  - Add migration for existing users to create default profiles
  - Implement rollback procedures for schema changes
  - Add data validation scripts to ensure integrity
  - _Requirements: 8.5_

- [ ] 12. Implement comprehensive testing suite
  - Write unit tests for UserProfileService and UserPreferencesService
  - Create integration tests for multi-organization scenarios
  - Add API endpoint tests with proper authentication and authorization
  - Build performance tests for profile and preference queries
  - Test audit logging and soft deletion functionality
  - _Requirements: All requirements validation_

- [ ] 13. Add UI components for profile management
  - Create user profile display component showing business role and organization context
  - Build profile editing form with validation and error handling
  - Add notification preferences interface with granular controls
  - Create dashboard customization settings panel
  - Implement organization switching UI for multi-org users
  - _Requirements: 1.3, 2.1, 4.3, 5.1, 6.1_

- [ ] 14. Implement preference-based application customization
  - Apply user timezone and date/time format preferences across the application
  - Implement dashboard layout customization based on user preferences
  - Add notification delivery based on user notification settings
  - Create language/locale switching based on user preferences
  - Apply compact mode and other UI preferences throughout the interface
  - _Requirements: 4.4, 5.4_

- [ ] 15. Add performance optimization and monitoring
  - Implement caching for frequently accessed user context data
  - Add database query optimization for profile and preference lookups
  - Create monitoring for profile service performance
  - Implement efficient bulk operations for user management
  - Add query analysis and index optimization based on usage patterns
  - _Requirements: 8.1, 8.3, 8.4, 8.5_
