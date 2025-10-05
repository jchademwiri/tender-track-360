# Implementation Plan

- [x] 1. Add required enums for new table status fields


  - Create pgEnum definitions for project_status, purchase_order_status, address_type, event_type, reminder_type, and notification_type
  - Place enums in the ENUMS section of schema.ts after existing enums
  - _Requirements: 6.3, 8.3_





- [ ] 2. Implement project management tables
  - [ ] 2.1 Create project table with organization isolation and soft deletion
    - Define project table with all required fields including status, dates, budget, and relationships


    - Include organizationId foreign key and soft deletion fields (deletedAt, deletedBy)
    - Add proper foreign key references to client, tender, organization, and user tables
    - _Requirements: 1.1, 1.4, 6.1, 6.2_



  - [ ] 2.2 Create purchase order table with project relationship
    - Define purchaseOrder table with order number, project link, supplier reference, and status tracking
    - Include organization isolation and soft deletion capabilities




    - Add unique constraint on order_number field
    - _Requirements: 1.2, 6.1, 6.2_

  - [x] 2.3 Create purchase order items table for line item tracking


    - Define purchaseOrderItem table with quantity, pricing, and description fields
    - Link to purchaseOrder with cascade deletion
    - Store monetary values as text for precision
    - _Requirements: 1.3, 6.4_



- [ ] 3. Implement client management tables
  - [x] 3.1 Create client table with comprehensive business information




    - Define client table with company details, registration numbers, and industry information
    - Include organization isolation and soft deletion fields
    - Add proper audit trail with createdBy, createdAt, updatedAt fields
    - _Requirements: 2.1, 2.4, 6.1, 6.2_



  - [ ] 3.2 Create client contact table for multiple contact persons
    - Define clientContact table with contact details and primary contact designation




    - Link to client table with cascade deletion
    - Support multiple contacts per client with isPrimary flag
    - _Requirements: 2.2, 6.4_



  - [ ] 3.3 Create client address table for location management
    - Define clientAddress table with full address fields and address type enum
    - Support multiple addresses per client with type categorization
    - Include isPrimary flag for default address selection


    - _Requirements: 2.3, 6.4_

- [x] 4. Implement calendar and scheduling tables




  - [ ] 4.1 Create calendar event table with polymorphic relationships
    - Define calendarEvent table with date/time fields, location, and event type
    - Implement polymorphic relationships to link events to tenders, projects, or clients




    - Include organization isolation and soft deletion capabilities
    - _Requirements: 3.1, 3.4, 6.1, 6.2_

  - [x] 4.2 Create reminder table for notification scheduling


    - Define reminder table with reminder dates, completion status, and polymorphic links
    - Link reminders to users and organizations with proper foreign keys
    - Support different reminder types through enum field
    - _Requirements: 3.2, 3.3, 6.1_



- [ ] 5. Implement user preferences and notification tables
  - [ ] 5.1 Create user preferences table for personal settings
    - Define userPreferences table with theme, language, timezone, and format preferences
    - Store dashboard layout and additional preferences as JSON fields


    - Link to user table with cascade deletion
    - _Requirements: 4.1, 6.4, 8.4_





  - [ ] 5.2 Create notification preferences table for user notification controls
    - Define notificationPreferences table with boolean flags for different notification types
    - Include preferences for email, push, SMS, and specific feature notifications


    - Link to user table with cascade deletion
    - _Requirements: 4.2, 4.4, 6.4_

  - [ ] 5.3 Create user notifications table for notification records
    - Define userNotifications table with title, message, type, and read status
    - Implement polymorphic relationships for linking notifications to related entities
    - Include organization context and read timestamp tracking
    - _Requirements: 4.3, 4.5, 6.1_

- [x] 6. Implement analytics table





  - [ ] 6.1 Create analytics table for metrics tracking
    - Define analytics table with metric type, value, date, and dimensions
    - Store metric values as text for precision and dimensions as JSON
    - Include organization isolation for multi-tenant analytics


    - _Requirements: 5.1, 5.2, 5.3, 5.4, 6.1, 8.4_

- [ ] 7. Define table relationships and relations
  - [ ] 7.1 Create Drizzle relations for project management tables
    - Define relations for project table linking to organization, user, client, tender, and purchase orders
    - Create relations for purchaseOrder linking to project, client (supplier), and items
    - Define relations for purchaseOrderItem linking back to purchase order
    - _Requirements: 6.5, 8.1, 8.2_

  - [ ] 7.2 Create Drizzle relations for client management tables
    - Define relations for client table linking to organization, user, contacts, and addresses
    - Create relations for clientContact and clientAddress linking back to client
    - Establish bidirectional relationships where appropriate
    - _Requirements: 6.5, 8.1, 8.2_

  - [ ] 7.3 Create Drizzle relations for calendar and user preference tables
    - Define relations for calendarEvent linking to organization and user
    - Create relations for reminder linking to user and organization
    - Define relations for all user preference tables linking to user
    - Create relations for userNotifications linking to user and organization
    - _Requirements: 6.5, 8.1, 8.2_

  - [ ] 7.4 Create Drizzle relations for analytics table
    - Create relations for analytics linking to organization
    - Ensure all relations support proper query optimization
    - _Requirements: 6.5, 8.1, 8.2_

- [ ] 8. Export TypeScript types and update schema object
  - [ ] 8.1 Generate TypeScript inference types for all new tables
    - Create type exports using typeof table.$inferSelect pattern
    - Follow existing naming conventions for consistency
    - Include types for all 12 new tables
    - _Requirements: 8.1, 8.4_

  - [ ] 8.2 Update main schema export object
    - Add all new tables to the schema export object
    - Include all new relations in the schema export
    - Maintain alphabetical organization within categories
    - _Requirements: 8.5_

- [ ]\* 8.3 Write unit tests for new table definitions
  - Create tests to verify table creation and field constraints
  - Test foreign key relationships and cascade behavior
  - Validate enum constraints and default values
  - Test TypeScript type inference for all new tables
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 9. Validate schema integration and consistency
  - [ ] 9.1 Verify all foreign key references are valid
    - Check that all referenced tables exist and have correct field names
    - Validate cascade deletion rules are appropriate
    - Ensure organization isolation is properly implemented
    - _Requirements: 6.3, 6.5, 7.1_

  - [ ] 9.2 Test schema compilation and type checking
    - Verify the expanded schema compiles without TypeScript errors
    - Test that all relations are properly defined and bidirectional where needed
    - Validate that enum values are correctly typed
    - _Requirements: 8.1, 8.2, 8.3, 8.5_
