# Requirements Document

## Introduction

This feature simplifies the existing database schema from 21 tables down to approximately 15 tables by removing complex features that are not essential for the MVP (Minimum Viable Product). The goal is to streamline the database structure while maintaining all core business functionality, focusing on the essential tender management workflow: Organization → Client → Tender → Follow-up → Project → Purchase Order.

The simplification will remove complex tables and relationships that add unnecessary complexity for the initial product launch, while preserving all advanced organization features needed for production deployment.

## Requirements

### Requirement 1: Remove Complex Contract Management

**User Story:** As a system architect, I want to remove the contract management complexity, so that the tender-to-project workflow is simplified and more direct.

#### Acceptance Criteria

1. WHEN I remove the contract table THEN the system SHALL maintain direct tender-to-project relationships
2. WHEN tenders are won THEN the system SHALL allow direct conversion to projects without intermediate contract steps
3. WHEN I migrate existing data THEN the system SHALL preserve all tender and project relationships
4. WHEN I update tender status THEN the system SHALL use simplified statuses: draft, submitted, won, lost, pending
5. WHEN projects are created THEN the system SHALL inherit information directly from tenders

### Requirement 2: Simplify Purchase Order Structure

**User Story:** As a project manager, I want simplified purchase orders without complex line item management, so that I can quickly create purchase orders with essential information only.

#### Acceptance Criteria

1. WHEN I remove purchase_order_item table THEN the system SHALL store purchase order information as single description and total amount
2. WHEN I create purchase orders THEN the system SHALL require only supplier name, description, and total amount
3. WHEN I update purchase order status THEN the system SHALL use simplified statuses: draft, sent, delivered
4. WHEN I migrate existing purchase orders THEN the system SHALL consolidate line items into single description and total
5. WHEN I view purchase orders THEN the system SHALL display simplified structure without complex item breakdowns

### Requirement 3: Streamline Follow-up Management

**User Story:** As a tender manager, I want simplified follow-up tracking, so that I can focus on essential communication without complex workflow management.

#### Acceptance Criteria

1. WHEN I simplify follow-up table THEN the system SHALL keep only essential fields: notes, contact person, next follow-up date
2. WHEN I remove complex follow-up fields THEN the system SHALL eliminate phone number, email, communication log, extension letter, feedback, status update, and notified fields
3. WHEN I create follow-ups THEN the system SHALL require only tender reference and notes
4. WHEN I migrate existing follow-ups THEN the system SHALL preserve notes and contact person information
5. WHEN I track follow-ups THEN the system SHALL focus on simple note-taking and scheduling

### Requirement 4: Remove Unnecessary Control Systems

**User Story:** As a system administrator, I want to remove the control center complexity, so that organization settings are managed through existing organization features.

#### Acceptance Criteria

1. WHEN I remove control_center table THEN the system SHALL use existing organization and user preference systems
2. WHEN I migrate control center data THEN the system SHALL preserve essential settings in appropriate existing tables
3. WHEN users need preferences THEN the system SHALL use existing notification_preferences table
4. WHEN organizations need settings THEN the system SHALL use existing organization_security_settings table
5. WHEN I clean up references THEN the system SHALL remove all control center foreign key relationships

### Requirement 5: Simplify Project Status Management

**User Story:** As a project manager, I want simplified project statuses, so that project tracking is straightforward without complex workflow states.

#### Acceptance Criteria

1. WHEN I update project status enum THEN the system SHALL use only: active, completed, cancelled
2. WHEN I remove complex statuses THEN the system SHALL eliminate planning and on_hold states
3. WHEN I migrate existing projects THEN the system SHALL map planning status to active and on_hold to active
4. WHEN projects are created THEN the system SHALL default to active status
5. WHEN I track project progress THEN the system SHALL use simple three-state workflow

### Requirement 6: Maintain Essential Advanced Features

**User Story:** As a system administrator, I want to preserve all advanced organization features, so that the system remains production-ready with proper security and audit capabilities.

#### Acceptance Criteria

1. WHEN I simplify the schema THEN the system SHALL keep all user, session, account, and verification tables
2. WHEN I preserve organization features THEN the system SHALL maintain member, invitation, ownership_transfer, and security_audit_log tables
3. WHEN I keep security features THEN the system SHALL preserve organization_security_settings and session_tracking tables
4. WHEN I maintain audit capabilities THEN the system SHALL keep organization_deletion_log table
5. WHEN I preserve notifications THEN the system SHALL maintain notification_preferences table

### Requirement 7: Ensure Data Migration Safety

**User Story:** As a database administrator, I want safe data migration during simplification, so that no critical business data is lost during the schema changes.

#### Acceptance Criteria

1. WHEN I generate migrations THEN the system SHALL create safe migration scripts that preserve existing data
2. WHEN I remove tables THEN the system SHALL first verify no critical data will be lost
3. WHEN I simplify table structures THEN the system SHALL migrate existing data to new simplified format
4. WHEN I update enum values THEN the system SHALL map existing values to new simplified enums
5. WHEN migrations complete THEN the system SHALL verify data integrity and relationship consistency

### Requirement 8: Optimize for MVP Development Speed

**User Story:** As a development team, I want a simplified schema that accelerates MVP development, so that we can deliver core functionality faster without complex edge cases.

#### Acceptance Criteria

1. WHEN I implement CRUD operations THEN the system SHALL have fewer tables to manage and test
2. WHEN I create user interfaces THEN the system SHALL have simplified data structures that are easier to display
3. WHEN I write business logic THEN the system SHALL have fewer complex relationships to handle
4. WHEN I debug issues THEN the system SHALL have clearer data flow without unnecessary complexity
5. WHEN I add new features THEN the system SHALL have a solid, simple foundation to build upon
