# Implementation Plan

## Phase 1: Database Schema Creation (5 New Tables)

- [x] 1. Create client table with embedded contact fields
  - Create client table with organizationId, name, notes, contactName, contactEmail, contactPhone
  - Add proper foreign key constraints and organization isolation
  - Include soft deletion support with deletedAt field
  - Add database indexes for search optimization
  - _Requirements: 1.2_

- [x] 1.1 Create tender table with unique tender numbers
  - Create tender table with organizationId, tenderNumber (unique), description, clientId
  - Add submissionDate, value, status fields with proper constraints
  - Include foreign key relationship to client table
  - Add soft deletion support and audit fields
  - _Requirements: 1.3_

- [x] 1.2 Create project table with tender inheritance support
  - Create project table with organizationId, projectNumber, description
  - Add optional tenderId and clientId foreign key relationships
  - Include status field with default 'active' value
  - Add soft deletion support and audit fields
  - _Requirements: 1.4_

- [x] 1.3 Create purchaseOrder table with project relationships
  - Create purchaseOrder table with organizationId, projectId, supplierName
  - Add description, totalAmount, status, notes fields
  - Include foreign key relationship to project table
  - Add soft deletion support and audit fields
  - _Requirements: 1.5_

- [x] 1.4 Create followUp table with tender and user relationships
  - Create followUp table with organizationId, tenderId, notes, contactPerson
  - Add nextFollowUpDate and createdBy fields with user foreign key
  - Include foreign key relationship to tender table
  - Add soft deletion support and audit fields
  - _Requirements: 1.6_

- [x] 1.5 Add table relations and update schema exports
  - Create Drizzle relations for all new tables
  - Add TypeScript types for all new table schemas
  - Update schema export to include all new tables and relations
  - Verify all foreign key relationships are properly defined
  - _Requirements: 1.7_

- [ ]\* 1.6 Write database schema tests and validation
  - Create automated tests for all new table schemas
  - Test foreign key constraints and organization isolation
  - Verify soft deletion functionality across all tables
  - Test database indexes and query performance
  - _Requirements: 1.7_

## Phase 2: Client Management Foundation (MVP)

- [x] 2. Create client management server actions
  - Implement server actions for client CRUD operations with embedded contact
  - Add organization isolation and authentication validation
  - Include input validation using Zod schemas
  - _Requirements: 2.1, 2.3, 2.4_

- [x] 2.1 Implement client CRUD server actions
  - Create getClients server action with pagination and search
  - Create createClient server action with validation
  - Create updateClient and deleteClient server actions
  - Add organization-scoped queries to ensure data isolation
  - _Requirements: 2.1, 2.3, 2.4_

- [x] 2.2 Implement client search and filtering server actions
  - Create searchClients server action across client name and contact information

  - Add pagination support for large client lists
  - Implement sorting by name, created date
  - _Requirements: 2.6_

- [ ]\* 2.3 Write unit tests for client server actions
  - Test all CRUD server actions with various scenarios
  - Test organization isolation and soft deletion
  - Test search and filtering functionality
  - _Requirements: 2.1, 2.3, 2.5, 2.6_

- [x] 3. Build client management UI components
  - Create responsive React components for client management
  - Implement form validation and error handling
  - Add loading states and optimistic updates
  - _Requirements: 2.1, 2.6, 2.7_

- [x] 3.1 Create ClientList component with search and pagination
  - Build client listing table with sortable columns
  - Add real-time search functionality
  - Implement pagination controls and loading states
  - _Requirements: 2.1, 2.6_

- [x] 3.2 Create ClientForm component for create/edit operations
  - Build client form with embedded contact fields
  - Add form state management and error display
  - Implement optimistic updates and loading states
  - _Requirements: 2.1, 2.3_

- [x] 3.3 Create ClientDetails component with contact view
  - Build client detail view with contact information
  - Add edit mode toggle and inline editing capabilities
  - Implement breadcrumb navigation and action menus
  - _Requirements: 2.7_

- [ ]\* 3.4 Write component unit tests for client UI
  - Test all client components with various props
  - Test form validation and error states
  - Test user interactions and state changes
  - _Requirements: 2.1, 2.3, 2.5, 2.6, 2.7_

- [x] 4. Implement client management pages and routing
  - Create Next.js pages for client management workflows
  - Add navigation and breadcrumb components
  - Implement responsive design for mobile devices
  - _Requirements: 2.1, 2.6, 2.7_

- [x] 4.1 Create client listing page with features
  - Build main client listing page with search and filters
  - Add responsive design for mobile and tablet
  - Implement client creation and editing workflows
  - _Requirements: 2.1, 2.6_

- [x] 4.2 Create client detail page with contact view
  - Build detailed client view with contact information
  - Add edit mode toggle and inline editing capabilities
  - Implement breadcrumb navigation and action menus
  - _Requirements: 2.7_

## Phase 3: Core Tender Management (MVP)

- [x] 5. Create tender management server actions
  - Implement server actions for tender CRUD operations
  - Add tender queries with client relationships using tender numbers
  - Include tender status workflow management
  - _Requirements: 3.1, 3.3, 3.7_

- [x] 5.1 Implement tender CRUD server actions
  - Create getTenders server action with filtering and client joins
  - Create createTender server action with tender number validation
  - Create updateTender and deleteTender server actions
  - Add organization-scoped queries and soft deletion
  - _Requirements: 3.1, 3.3, 3.6_

- [x] 5.2 Implement tender search and status server actions
  - Create searchTenders server action across tender number, client name, and description
  - Create updateTenderStatus server action with validation
  - Add filtering by status, client, and date ranges
  - Implement sorting by tender number, created date, and status
  - _Requirements: 3.4, 3.5, 3.8_

- [x] 5.3 Create tender number validation system
  - Implement tender number uniqueness validation in server actions
  - Add tender number format validation and checks
  - Create tender number input validation rules using Zod
  - _Requirements: 3.1, 3.8_

- [ ]\* 5.4 Write unit tests for tender server actions
  - Test all tender CRUD server actions and validations
  - Test tender-client relationships and joins
  - Test tender number validation and uniqueness
  - _Requirements: 3.1, 3.3, 3.4, 3.5, 3.6, 3.7_

- [x] 6. Build tender management UI components
  - Create responsive React components for tender management
  - Implement tender number-based interfaces
  - Add simplified status workflow UI components
  - _Requirements: 3.1, 3.3, 3.4, 3.7_

- [x] 6.1 Create TenderList component with tender number display
  - Build tender listing table with tender number as primary identifier
  - Add status-based color coding and visual indicators
  - Implement search by tender number functionality
  - _Requirements: 3.4, 3.5, 3.8_

- [x] 6.2 Create TenderForm component for tender management
  - Build tender creation/editing form with client selection
  - Add tender number input field with validation for new tenders
  - Implement submission date picker and value formatting
  - _Requirements: 3.1, 3.2_

- [x] 6.3 Create TenderDetails component with tender number focus
  - Build tender detail view with tender number prominently displayed
  - Display related client information and contact details
  - Add quick actions for status updates and follow-ups
  - _Requirements: 3.7, 3.8_

- [ ]\* 6.4 Write component unit tests for tender UI
  - Test all tender components with various states
  - Test tender number input and validation
  - Test search and filtering interactions
  - _Requirements: 3.1, 3.3, 3.4, 3.5, 3.7_

- [x] 7. Implement tender management pages and workflows
  - Create Next.js pages for tender management
  - Add tender number-based navigation
  - Implement responsive design and mobile optimization
  - _Requirements: 3.1, 3.4, 3.7_

- [x] 7.1 Create tender listing page with tender number focus
  - Build main tender listing with tender number search
  - Add status summaries and filtering options
  - Implement responsive layout for various screen sizes
  - _Requirements: 3.4, 3.5, 3.8_

- [x] 7.2 Create tender detail page with comprehensive information
  - Build detailed tender view with tender number as title
  - Add action buttons for status updates and operations
  - Implement breadcrumb navigation with tender number
  - _Requirements: 3.7, 3.8_

- [x] 7.3 Create tender creation and editing workflows
  - Build guided tender creation process with number input validation
  - Add form validation and client selection interface
  - Implement tender number validation and display
  - _Requirements: 3.1, 3.2, 3.8_

## Phase 4: Follow-up Management (MVP)

- [ ] 8. Create follow-up management server actions
  - Implement server actions for follow-up CRUD operations
  - Add follow-up queries with tender relationships
  - Include simple follow-up tracking and management
  - _Requirements: 4.1, 4.3, 4.5_

- [ ] 8.1 Implement follow-up CRUD server actions
  - Create getFollowUps server action with tender joins
  - Create createFollowUp server action with tender relationship validation
  - Create updateFollowUp and deleteFollowUp server actions
  - Add user attribution and organization isolation
  - _Requirements: 4.1, 4.2, 4.8_

- [ ] 8.2 Implement follow-up search and filtering server actions
  - Create searchFollowUps server action across tender number and notes
  - Add filtering by tender and date ranges
  - Implement chronological sorting for follow-ups
  - Create getUpcomingFollowUps server action
  - _Requirements: 4.3, 4.7_

- [ ]\* 8.3 Write unit tests for follow-up server actions
  - Test all follow-up CRUD server actions and validations
  - Test follow-up-tender relationships
  - Test search and filtering functionality
  - _Requirements: 4.1, 4.2, 4.3, 4.7, 4.8_

- [ ] 9. Build follow-up management UI components
  - Create responsive React components for follow-up management
  - Implement simple follow-up interface
  - Add tender-based follow-up organization
  - _Requirements: 4.1, 4.3, 4.4_

- [ ] 9.1 Create FollowUpList component with chronological view
  - Build chronological follow-up listing for each tender
  - Add basic filtering and search functionality
  - Implement follow-up summary cards with key information
  - _Requirements: 4.3_

- [ ] 9.2 Create FollowUpForm component for follow-up management
  - Build follow-up creation/editing form with validation
  - Add contact person and notes fields
  - Implement next follow-up date scheduling interface
  - _Requirements: 4.1, 4.2, 4.4_

- [ ] 9.3 Create FollowUpDetails component for follow-up tracking
  - Build follow-up detail view with notes display
  - Add timestamp and user attribution display
  - Implement follow-up history and progression
  - _Requirements: 4.4, 4.8_

- [ ]\* 9.4 Write component unit tests for follow-up UI
  - Test all follow-up components with various states
  - Test follow-up creation and editing interfaces
  - Test tender-follow-up relationships in UI
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 10. Implement follow-up management pages
  - Create Next.js pages for follow-up management
  - Add follow-up organization by tender
  - Implement responsive design for follow-up workflows
  - _Requirements: 4.3, 4.4, 4.8_

- [ ] 10.1 Create follow-up management page with tender organization
  - Build follow-up listing organized by tender number
  - Add follow-up creation and editing interfaces
  - Implement responsive design for mobile follow-up management
  - _Requirements: 4.3, 4.4_

- [ ] 10.2 Create follow-up detail and history pages
  - Build follow-up detail pages with full information
  - Add follow-up progression and history tracking
  - Implement follow-up editing and management workflows
  - _Requirements: 4.4, 4.8_

## Phase 5: Project Management (MVP)

- [ ] 11. Create project management server actions
  - Implement server actions for project CRUD operations
  - Add project queries with tender inheritance logic
  - Include project number and description inheritance from tenders
  - _Requirements: 5.1, 5.2, 5.8_

- [ ] 11.1 Implement project CRUD server actions with inheritance
  - Create getProjects server action with filtering and tender joins
  - Create createProject server action with tender inheritance logic
  - Create createProjectFromTender server action for conversion
  - Create updateProject and deleteProject server actions
  - _Requirements: 5.1, 5.2, 5.3_

- [ ] 11.2 Implement project search and conversion server actions
  - Create searchProjects server action across project number and description
  - Add filtering by status and linked tender
  - Implement sorting by project number and creation date
  - Create tender-to-project conversion logic with inheritance
  - _Requirements: 5.5, 5.6, 5.8_

- [ ] 11.3 Create project inheritance and validation system
  - Implement automatic project number inheritance from tender numbers
  - Add project description inheritance from tender descriptions
  - Create project-tender relationship management
  - Add validation for standalone project creation
  - _Requirements: 5.1, 5.2, 5.8_

- [ ]\* 11.4 Write unit tests for project server actions
  - Test all project CRUD server actions and validations
  - Test tender-to-project conversion and inheritance
  - Test project number generation and uniqueness
  - _Requirements: 5.1, 5.2, 5.3, 5.5, 5.6, 5.8_

- [ ] 12. Build project management UI components
  - Create responsive React components for project management
  - Implement tender-to-project conversion interface
  - Add project number and inheritance display
  - _Requirements: 5.1, 5.5, 5.8_

- [ ] 12.1 Create ProjectList component with project number focus
  - Build project listing with project number as primary identifier
  - Add status-based organization and filtering
  - Implement project search by project number and description
  - _Requirements: 5.5, 5.6_

- [ ] 12.2 Create ProjectForm component for project creation
  - Build project creation form with inheritance options
  - Add project number display and validation
  - Implement project description editing with inheritance
  - _Requirements: 5.1, 5.3_

- [ ] 12.3 Create ProjectDetails component with tender relationship
  - Build project detail view with project number prominently displayed
  - Display linked tender information and inheritance details
  - Add quick actions for project management and PO creation
  - _Requirements: 5.8_

- [ ] 12.4 Create TenderToProjectConverter component
  - Build tender-to-project conversion interface
  - Add conversion preview with inherited information
  - Implement conversion confirmation and validation
  - _Requirements: 5.1, 5.2_

- [ ]\* 12.5 Write component unit tests for project UI
  - Test all project components with various states
  - Test tender-to-project conversion interface
  - Test project inheritance and display logic
  - _Requirements: 5.1, 5.2, 5.5, 5.8_

- [ ] 13. Implement project management pages and workflows
  - Create Next.js pages for project management
  - Add tender-to-project conversion workflows
  - Implement responsive design for project management
  - _Requirements: 5.5, 5.8_

- [ ] 13.1 Create project management page with conversion
  - Build project listing with tender conversion options
  - Add project creation and editing workflows
  - Implement responsive design for project management
  - _Requirements: 5.5, 5.6_

- [ ] 13.2 Create project detail and management pages
  - Build project detail pages with full inheritance information
  - Add project editing and status management
  - Implement project-to-PO creation workflows
  - _Requirements: 5.8_

## Phase 6: Purchase Order Management (MVP)

- [ ] 14. Create purchase order management server actions
  - Implement server actions for PO CRUD operations
  - Add PO queries with project relationships
  - Include supplier name defaulting to organization name
  - _Requirements: 6.1, 6.2, 6.8_

- [ ] 14.1 Implement purchase order CRUD server actions
  - Create getPurchaseOrders server action with project joins
  - Create createPurchaseOrder server action with supplier defaulting
  - Create updatePurchaseOrder and deletePurchaseOrder server actions
  - Add project relationship validation and organization isolation
  - _Requirements: 6.1, 6.2, 6.7_

- [ ] 14.2 Implement purchase order search and filtering server actions
  - Create searchPurchaseOrders server action across project number, supplier name, and description
  - Add filtering by project, supplier, and status
  - Implement sorting by creation date and amount
  - Create getProjectPurchaseOrders server action for project-based listing
  - _Requirements: 6.6, 6.8_

- [ ] 14.3 Create supplier name management system
  - Implement organization name as default supplier in server actions
  - Add custom supplier name override for outsourcing
  - Create supplier name validation and management logic
  - Add updatePurchaseOrderStatus server action
  - _Requirements: 6.1, 6.2, 6.4_

- [ ]\* 14.4 Write unit tests for purchase order server actions
  - Test all PO CRUD server actions and validations
  - Test PO-project relationships and joins
  - Test supplier name defaulting and override logic
  - _Requirements: 6.1, 6.2, 6.6, 6.7, 6.8_

- [ ] 15. Build purchase order management UI components
  - Create responsive React components for PO management
  - Implement supplier name defaulting interface
  - Add project-based PO organization
  - _Requirements: 6.1, 6.5, 6.8_

- [ ] 15.1 Create PurchaseOrderList component with project organization
  - Build PO listing organized by project number
  - Add supplier name and amount display
  - Implement PO search and filtering by project
  - _Requirements: 6.5, 6.6_

- [ ] 15.2 Create PurchaseOrderForm component with supplier defaulting
  - Build PO creation form with project selection
  - Add supplier name field with organization name default
  - Implement supplier name override for outsourcing
  - Add description and amount input with validation
  - _Requirements: 6.1, 6.2, 6.3_

- [ ] 15.3 Create PurchaseOrderDetails component with project relationship
  - Build PO detail view with project information
  - Display supplier information and outsourcing status
  - Add quick actions for PO status updates
  - _Requirements: 6.8_

- [ ]\* 15.4 Write component unit tests for purchase order UI
  - Test all PO components with various states
  - Test supplier name defaulting and override logic
  - Test project-PO relationships in UI
  - _Requirements: 6.1, 6.2, 6.5, 6.8_

- [ ] 16. Implement purchase order management pages and workflows
  - Create Next.js pages for PO management
  - Add project-based PO organization and workflows
  - Implement responsive design for PO management
  - _Requirements: 6.5, 6.8_

- [ ] 16.1 Create purchase order management page with project focus
  - Build PO listing organized by project with creation options
  - Add PO creation and editing workflows
  - Implement responsive design for PO management
  - _Requirements: 6.5, 6.6_

- [ ] 16.2 Create purchase order detail and management pages
  - Build PO detail pages with full project and supplier information
  - Add PO editing and status management workflows
  - Implement PO history and tracking features
  - _Requirements: 6.8_
