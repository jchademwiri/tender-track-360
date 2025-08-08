# Phase 0: Database Design - Better Auth Integration Tasks

- [ ] 1. Set up Better Auth with Drizzle integration and organization support

  - Install Better Auth and configure with Drizzle adapter
  - Enable Better Auth organization plugin for multi-tenancy
  - Configure email/password authentication with organization creation
  - Test Better Auth table generation (user, organization, member, session, etc.)
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 2. Create business extension tables for Better Auth integration

  - Create userProfiles table to extend Better Auth user data with business roles
  - Add user preferences table for notification settings
  - Create indexes for organization-based queries
  - Set up foreign key references to Better Auth tables (using text IDs)
  - _Requirements: 1.2, 1.3, 1.4_

- [ ] 3. Design core tender management schema with Better Auth references

  - Update tenders table to reference Better Auth organization.id and user.id
  - Add composite unique constraint for reference numbers within organizations
  - Create proper foreign key relationships to clients and categories
  - Add tags array field for flexible categorization
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 4. Update client and category management tables for Better Auth

  - Update clients table with Better Auth organization and user references
  - Update tender categories to support both system defaults and organization-specific
  - Add proper indexes for efficient querying with text-based IDs
  - Create seed data for default categories
  - _Requirements: 2.1, 2.2, 2.4_

- [ ] 5. Implement comprehensive audit trail system with Better Auth users

  - Create enhanced activity logs table with JSON fields for change tracking
  - Create status transitions table for tender status change history
  - Update all user references to use Better Auth user.id (text type)
  - Implement change detection and logging utilities
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 6. Design document management schema for UploadThing with Better Auth

  - Create enhanced documents table with UploadThing URL and key fields
  - Add document versioning support with parent-child relationships
  - Implement Better Auth organization-based document isolation
  - Add document metadata fields for search and categorization
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 7. Create performance optimization indexes for Better Auth integration

  - Add composite indexes for common query patterns with text-based IDs
  - Create organization-based indexes for multi-tenant queries
  - Add time-based indexes for audit and activity queries
  - Optimize indexes for tender search and filtering with Better Auth context
  - _Requirements: 5.1, 5.2, 5.3_

- [ ] 8. Implement database constraints and validation for Better Auth

  - Add check constraints for business rule enforcement
  - Create unique constraints for reference number uniqueness within organizations
  - Add foreign key constraints with proper cascade rules for text IDs
  - Implement soft delete constraints and validation
  - _Requirements: 2.3, 3.1, 5.4_

- [ ] 9. Set up database migrations and seeding with Better Auth schema

  - Create Drizzle migration files for all business schema changes
  - Implement database seeding for default categories and system data
  - Create migration rollback procedures
  - Set up database backup and restore procedures
  - _Requirements: 5.4_

- [ ] 10. Create Better Auth integration utilities and helpers

  - Build organization context utilities for queries using Better Auth session
  - Create audit logging helper functions with Better Auth user context
  - Implement database connection pooling configuration
  - Add database health check and monitoring utilities
  - _Requirements: 1.4, 3.4, 5.3, 5.4_

- [ ] 11. Implement row-level security policies with Better Auth

  - Create RLS policies for organization-based data isolation using Better Auth
  - Implement user role-based access policies with Better Auth member roles
  - Add audit trail protection policies
  - Test security policy enforcement with Better Auth session context
  - _Requirements: 1.4, 3.4_

- [ ] 12. Create database testing and validation for Better Auth integration
  - Write unit tests for database schema validation with Better Auth tables
  - Create integration tests for multi-tenant data isolation
  - Test audit trail functionality and data integrity
  - Validate performance with sample data sets and Better Auth context
  - _Requirements: All requirements validation_
