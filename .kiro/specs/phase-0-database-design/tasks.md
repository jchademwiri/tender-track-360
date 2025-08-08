# Phase 0: Database Design - Implementation Plan

- [ ] 1. Set up Better Auth with Drizzle integration

  - Install Better Auth and configure with Drizzle adapter
  - Set up Better Auth configuration for organization-based multi-tenancy
  - Configure email/password authentication with role assignment
  - Test Better Auth table generation and user creation flow
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 2. Create organization and enhanced user schema

  - Create organizations table with proper fields and constraints
  - Enhance users table with organizationId and onboarding fields
  - Add user preferences table for notification settings
  - Create indexes for organization-based queries
  - _Requirements: 1.2, 1.3, 1.4_

- [ ] 3. Design core tender management schema

  - Create enhanced tenders table with organization isolation
  - Add composite unique constraint for reference numbers within organizations
  - Create proper foreign key relationships to clients and categories
  - Add tags array field for flexible categorization
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 4. Create client and category management tables

  - Enhance clients table with organization isolation
  - Update tender categories to support both system defaults and organization-specific categories
  - Add proper indexes for efficient querying
  - Create seed data for default categories
  - _Requirements: 2.1, 2.2, 2.4_

- [ ] 5. Implement comprehensive audit trail system

  - Create enhanced activity logs table with JSON fields for change tracking
  - Create status transitions table for tender status change history
  - Add triggers for automatic audit logging on data changes
  - Implement change detection and logging utilities
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 6. Design document management schema for UploadThing integration

  - Create enhanced documents table with UploadThing URL and key fields
  - Add document versioning support with parent-child relationships
  - Implement organization-based document isolation
  - Add document metadata fields for search and categorization
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 7. Create performance optimization indexes

  - Add composite indexes for common query patterns
  - Create organization-based indexes for multi-tenant queries
  - Add time-based indexes for audit and activity queries
  - Optimize indexes for tender search and filtering
  - _Requirements: 5.1, 5.2, 5.3_

- [ ] 8. Implement database constraints and validation

  - Add check constraints for business rule enforcement
  - Create unique constraints for reference number uniqueness within organizations
  - Add foreign key constraints with proper cascade rules
  - Implement soft delete constraints and validation
  - _Requirements: 2.3, 3.1, 5.4_

- [ ] 9. Set up database migrations and seeding

  - Create Drizzle migration files for all schema changes
  - Implement database seeding for default categories and system data
  - Create migration rollback procedures
  - Set up database backup and restore procedures
  - _Requirements: 5.4_

- [ ] 10. Create database utilities and helpers

  - Build organization isolation utilities for queries
  - Create audit logging helper functions
  - Implement database connection pooling configuration
  - Add database health check and monitoring utilities
  - _Requirements: 1.4, 3.4, 5.3, 5.4_

- [ ] 11. Implement row-level security policies

  - Create RLS policies for organization-based data isolation
  - Implement user role-based access policies
  - Add audit trail protection policies
  - Test security policy enforcement
  - _Requirements: 1.4, 3.4_

- [ ] 12. Create database testing and validation
  - Write unit tests for database schema validation
  - Create integration tests for multi-tenant data isolation
  - Test audit trail functionality and data integrity
  - Validate performance with sample data sets
  - _Requirements: All requirements validation_
