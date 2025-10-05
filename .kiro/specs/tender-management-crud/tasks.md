# Implementation Plan

## Phase 1: Database Schema Updates (MVP Foundation)

- [x] 1. Create database migration for client table updates
  - Add primary contact fields to existing client table (primaryContactName, primaryContactEmail, primaryContactPhone, primaryContactPosition)
  - Remove industry field from client table (if exists)
  - Ensure all existing client data is preserved during migration
  - Add database indexes for new primary contact fields
  - _Requirements: 1.1, 1.2_

- [x] 1.1 Create database migration for tender table updates
  - Replace title field with tenderNumber field (ensure uniqueness)
  - Add uniqueness validation logic for user-input tender numbers
  - Migrate existing title data to tenderNumber where applicable
  - Update database constraints and indexes
  - _Requirements: 1.1, 1.2_

- [x] 1.2 Create database migration for project table updates
  - Replace name field with projectNumber field
  - Add projectDescription field
  - Add logic to inherit projectNumber from tender number when linked
  - Add logic to inherit description from tender when linked
  - Ensure existing project data is preserved
  - _Requirements: 1.1, 1.2_

- [x] 1.3 Create database migration for purchase order table updates
  - Update supplierName field to default to organization name
  - Add database trigger or application logic for supplier name defaulting
  - Ensure existing purchase order data is preserved
  - Update related constraints and indexes
  - _Requirements: 1.1, 1.2_

- [x] 1.4 Validate and test all database migrations
  - Run migrations on test database with existing data
  - Verify all constraints and relationships are maintained
  - Test rollback procedures for all migrations
  - Ensure no data loss or corruption occurs
  - _Requirements: 1.6, 1.7_

- [x]\* 1.5 Write migration tests and validation scripts
  - Create automated tests for all database migrations
  - Test data integrity before and after migrations
  - Verify all existing functionality continues to work
  - Create rollback validation tests
  - _Requirements: 1.6, 1.7_

## Phase 2: Client Management Foundation (MVP)

- [ ] 2. Set up client management database layer
  - Create database service functions for client CRUD operations with embedded primary contact
  - Implement client queries with organization isolation and soft deletion
  - Add database indexes for client search and filtering
  - _Requirements: 2.1, 2.3, 2.4_

- [ ] 2.1 Create client repository with CRUD operations and embedded contact
  - Write client creation, read, update, and soft delete functions
  - Implement organization-scoped queries to ensure data isolation
  - Add input validation using Zod schemas for client and primary contact fields
  - _Requirements: 2.1, 2.3, 2.5_

- [ ] 2.2 Implement client search and filtering functionality
  - Create search queries across client name and primary contact information
  - Add pagination support for large client lists
  - Implement sorting by name, created date
  - _Requirements: 2.6_

- [ ]\* 2.3 Write unit tests for client repository operations
  - Test all CRUD operations with various scenarios
  - Test organization isolation and soft deletion
  - Test search and filtering functionality
  - _Requirements: 2.1, 2.3, 2.5, 2.6_

- [ ] 3. Create client management API endpoints
  - Implement REST API endpoints for client operations
  - Add authentication middleware and organization validation
  - Implement error handling and response formatting
  - _Requirements: 2.1, 2.3, 2.4_

- [ ] 3.1 Implement client CRUD API routes
  - Create GET /api/clients with pagination and search
  - Create POST /api/clients for client creation
  - Create PUT /api/clients/[id] for client updates
  - Create DELETE /api/clients/[id] for soft deletion
  - _Requirements: 2.1, 2.3, 2.4_

- [ ]\* 3.2 Write API integration tests for client endpoints
  - Test all client API endpoints with authentication
  - Test error scenarios and validation
  - Test organization isolation in API responses
  - _Requirements: 2.1, 2.3, 2.5_

- [ ] 4. Build client management UI components
  - Create responsive React components for client management
  - Implement form validation and error handling
  - Add loading states and optimistic updates
  - _Requirements: 2.1, 2.6, 2.7_

- [ ] 4.1 Create ClientList component with search and pagination
  - Build client listing table with sortable columns
  - Add real-time search functionality
  - Implement pagination controls and loading states
  - _Requirements: 2.1, 2.6_

- [ ] 4.2 Create ClientForm component for create/edit operations
  - Build client form with embedded primary contact fields
  - Add form state management and error display
  - Implement optimistic updates and loading states
  - _Requirements: 2.1, 2.3_

- [ ] 4.3 Create ClientDetails component with simple view
  - Build client detail view with primary contact information
  - Add edit mode toggle and inline editing capabilities
  - Implement breadcrumb navigation and action menus
  - _Requirements: 2.7_

- [ ]\* 4.4 Write component unit tests for client UI
  - Test all client components with various props
  - Test form validation and error states
  - Test user interactions and state changes
  - _Requirements: 2.1, 2.3, 2.5, 2.6, 2.7_

- [ ] 5. Implement client management pages and routing
  - Create Next.js pages for client management workflows
  - Add navigation and breadcrumb components
  - Implement responsive design for mobile devices
  - _Requirements: 2.1, 2.6, 2.7_

- [ ] 5.1 Create client listing page with features
  - Build main client listing page with search and filters
  - Add responsive design for mobile and tablet
  - Implement client creation and editing workflows
  - _Requirements: 2.1, 2.6_

- [ ] 5.2 Create client detail page with simple view
  - Build detailed client view with primary contact information
  - Add edit mode toggle and inline editing capabilities
  - Implement breadcrumb navigation and action menus
  - _Requirements: 2.7_

## Phase 3: Core Tender Management (MVP)

- [ ] 6. Set up tender management database layer
  - Create database service functions for tender CRUD operations
  - Implement tender queries with client relationships using tender numbers
  - Add tender status workflow management
  - _Requirements: 3.1, 3.3, 3.7_

- [ ] 6.1 Create tender repository with CRUD operations
  - Write tender creation with user-input tender number validation
  - Implement tender read operations with client joins
  - Add tender update and soft deletion functionality
  - _Requirements: 3.1, 3.3, 3.6_

- [ ] 6.2 Implement tender search and filtering functionality
  - Create search across tender number, client name, and description
  - Add filtering by status, client, and date ranges
  - Implement sorting by tender number, created date, and status
  - _Requirements: 3.4, 3.5_

- [ ] 6.3 Create tender number validation system
  - Implement tender number uniqueness validation
  - Add tender number format validation and checks
  - Create tender number input validation rules
  - _Requirements: 3.1, 3.8_

- [ ]\* 6.4 Write unit tests for tender repository operations
  - Test all tender CRUD operations and validations
  - Test tender-client relationships and joins
  - Test tender number validation and uniqueness
  - _Requirements: 3.1, 3.3, 3.4, 3.5, 3.6, 3.7_

- [ ] 7. Create tender management API endpoints
  - Implement REST API endpoints for tender operations
  - Add filtering and search capabilities
  - Implement tender number-based operations
  - _Requirements: 3.1, 3.3, 3.4, 3.5_

- [ ] 7.1 Implement tender CRUD API routes
  - Create GET /api/tenders with filtering by tender number
  - Create POST /api/tenders for tender creation with number validation
  - Create PUT /api/tenders/[id] for tender updates
  - Create DELETE /api/tenders/[id] for soft deletion
  - _Requirements: 3.1, 3.3, 3.6_

- [ ] 7.2 Implement tender search API routes
  - Create GET /api/tenders/search for tender number and description search
  - Add status update API endpoint with validation
  - Implement tender lookup by tender number
  - _Requirements: 3.4, 3.5, 3.8_

- [ ]\* 7.3 Write API integration tests for tender endpoints
  - Test all tender API endpoints with various scenarios
  - Test search and filtering functionality
  - Test tender number validation and uniqueness
  - _Requirements: 3.1, 3.3, 3.4, 3.5, 3.6_

- [ ] 8. Build tender management UI components
  - Create responsive React components for tender management
  - Implement tender number-based interfaces
  - Add simplified status workflow UI components
  - _Requirements: 3.1, 3.3, 3.4, 3.7_

- [ ] 8.1 Create TenderList component with tender number display
  - Build tender listing table with tender number as primary identifier
  - Add status-based color coding and visual indicators
  - Implement search by tender number functionality
  - _Requirements: 3.4, 3.5, 3.8_

- [ ] 8.2 Create TenderForm component for tender management
  - Build tender creation/editing form with client selection
  - Add tender number input field with validation for new tenders
  - Implement submission date picker and value formatting
  - _Requirements: 3.1, 3.2_

- [ ] 8.3 Create TenderDetails component with tender number focus
  - Build tender detail view with tender number prominently displayed
  - Display related client information and contact details
  - Add quick actions for status updates and follow-ups
  - _Requirements: 3.7, 3.8_

- [ ]\* 8.4 Write component unit tests for tender UI
  - Test all tender components with various states
  - Test tender number input and validation
  - Test search and filtering interactions
  - _Requirements: 3.1, 3.3, 3.4, 3.5, 3.7_

- [ ] 9. Implement tender management pages and workflows
  - Create Next.js pages for tender management
  - Add tender number-based navigation
  - Implement responsive design and mobile optimization
  - _Requirements: 3.1, 3.4, 3.7_

- [ ] 9.1 Create tender listing page with tender number focus
  - Build main tender listing with tender number search
  - Add status summaries and filtering options
  - Implement responsive layout for various screen sizes
  - _Requirements: 3.4, 3.5, 3.8_

- [ ] 9.2 Create tender detail page with comprehensive information
  - Build detailed tender view with tender number as title
  - Add action buttons for status updates and operations
  - Implement breadcrumb navigation with tender number
  - _Requirements: 3.7, 3.8_

- [ ] 9.3 Create tender creation and editing workflows
  - Build guided tender creation process with number input validation
  - Add form validation and client selection interface
  - Implement tender number validation and display
  - _Requirements: 3.1, 3.2, 3.8_

## Phase 4: Follow-up Management (MVP)

- [ ] 10. Set up follow-up management database layer
  - Create database service functions for follow-up CRUD operations
  - Implement follow-up queries with tender relationships
  - Add simple follow-up tracking and management
  - _Requirements: 4.1, 4.3, 4.5_

- [ ] 10.1 Create follow-up repository with CRUD operations
  - Write follow-up creation with tender relationship validation
  - Implement follow-up read operations with tender joins
  - Add follow-up update and deletion functionality
  - _Requirements: 4.1, 4.2, 4.8_

- [ ] 10.2 Implement follow-up search and filtering
  - Create search across tender number and follow-up notes
  - Add filtering by tender and date ranges
  - Implement chronological sorting for follow-ups
  - _Requirements: 4.3, 4.7_

- [ ]\* 10.3 Write unit tests for follow-up repository operations
  - Test all follow-up CRUD operations and validations
  - Test follow-up-tender relationships
  - Test search and filtering functionality
  - _Requirements: 4.1, 4.2, 4.3, 4.7, 4.8_

- [ ] 11. Create follow-up management API endpoints
  - Implement REST API endpoints for follow-up operations
  - Add tender-based follow-up retrieval
  - Implement simple follow-up management APIs
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 11.1 Implement follow-up CRUD API routes
  - Create nested follow-up routes under tenders
  - Add follow-up creation with validation
  - Implement follow-up updates and management
  - _Requirements: 4.1, 4.2, 4.5_

- [ ] 11.2 Implement follow-up search API routes
  - Create follow-up search by tender number and notes
  - Add follow-up listing and filtering endpoints
  - Implement follow-up chronological retrieval
  - _Requirements: 4.3, 4.7_

- [ ]\* 11.3 Write API integration tests for follow-up endpoints
  - Test all follow-up API endpoints with authentication
  - Test follow-up-tender relationships
  - Test search and filtering functionality
  - _Requirements: 4.1, 4.2, 4.3, 4.7_

- [ ] 12. Build follow-up management UI components
  - Create responsive React components for follow-up management
  - Implement simple follow-up interface
  - Add tender-based follow-up organization
  - _Requirements: 4.1, 4.3, 4.4_

- [ ] 12.1 Create FollowUpList component with simple view
  - Build chronological follow-up listing for each tender
  - Add basic filtering and search functionality
  - Implement follow-up summary cards with key information
  - _Requirements: 4.3_

- [ ] 12.2 Create FollowUpForm component for simple follow-up management
  - Build follow-up creation/editing form with validation
  - Add contact person and notes fields
  - Implement next follow-up date scheduling interface
  - _Requirements: 4.1, 4.2, 4.4_

- [ ] 12.3 Create FollowUpDetails component for follow-up tracking
  - Build follow-up detail view with notes display
  - Add timestamp and user attribution display
  - Implement follow-up history and progression
  - _Requirements: 4.4, 4.8_

- [ ]\* 12.4 Write component unit tests for follow-up UI
  - Test all follow-up components with various states
  - Test follow-up creation and editing interfaces
  - Test tender-follow-up relationships in UI
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 13. Implement follow-up management pages
  - Create Next.js pages for follow-up management
  - Add follow-up organization by tender
  - Implement responsive design for follow-up workflows
  - _Requirements: 4.3, 4.4, 4.8_

- [ ] 13.1 Create follow-up management page with tender organization
  - Build follow-up listing organized by tender number
  - Add follow-up creation and editing interfaces
  - Implement responsive design for mobile follow-up management
  - _Requirements: 4.3, 4.4_

- [ ] 13.2 Create follow-up detail and history pages
  - Build follow-up detail pages with full information
  - Add follow-up progression and history tracking
  - Implement follow-up editing and management workflows
  - _Requirements: 4.4, 4.8_

## Phase 5: Project Management (MVP)

- [ ] 14. Set up project management database layer
  - Create database service functions for project CRUD operations
  - Implement project queries with tender inheritance logic
  - Add project number and description inheritance from tenders
  - _Requirements: 5.1, 5.2, 5.8_

- [ ] 14.1 Create project repository with CRUD operations and inheritance
  - Write project creation with tender inheritance logic
  - Implement project number inheritance from tender numbers
  - Add project description inheritance from tender descriptions
  - Add standalone project creation with custom numbers
  - _Requirements: 5.1, 5.2, 5.3_

- [ ] 14.2 Implement project search and filtering functionality
  - Create search across project number and description
  - Add filtering by status and linked tender
  - Implement sorting by project number and creation date
  - _Requirements: 5.5, 5.6_

- [ ] 14.3 Create tender-to-project conversion system
  - Implement won tender to project conversion logic
  - Add automatic project number and description inheritance
  - Create project-tender relationship management
  - _Requirements: 5.1, 5.2, 5.8_

- [ ]\* 14.4 Write unit tests for project repository operations
  - Test all project CRUD operations and validations
  - Test tender-to-project conversion and inheritance
  - Test project number generation and uniqueness
  - _Requirements: 5.1, 5.2, 5.3, 5.5, 5.6, 5.8_

- [ ] 15. Create project management API endpoints
  - Implement REST API endpoints for project operations
  - Add tender-to-project conversion APIs
  - Implement project inheritance and relationship APIs
  - _Requirements: 5.1, 5.3, 5.8_

- [ ] 15.1 Implement project CRUD API routes
  - Create GET /api/projects with project number search
  - Create POST /api/projects for project creation
  - Create PUT /api/projects/[id] for project updates
  - Create DELETE /api/projects/[id] for soft deletion
  - _Requirements: 5.1, 5.4, 5.7_

- [ ] 15.2 Implement project conversion API routes
  - Create POST /api/tenders/[id]/convert-to-project for conversion
  - Add project inheritance validation and processing
  - Implement project-tender relationship management
  - _Requirements: 5.1, 5.2, 5.8_

- [ ]\* 15.3 Write API integration tests for project endpoints
  - Test all project API endpoints with authentication
  - Test tender-to-project conversion functionality
  - Test project inheritance and relationship management
  - _Requirements: 5.1, 5.2, 5.3, 5.8_

- [ ] 16. Build project management UI components
  - Create responsive React components for project management
  - Implement tender-to-project conversion interface
  - Add project number and inheritance display
  - _Requirements: 5.1, 5.5, 5.8_

- [ ] 16.1 Create ProjectList component with project number focus
  - Build project listing with project number as primary identifier
  - Add status-based organization and filtering
  - Implement project search by project number and description
  - _Requirements: 5.5, 5.6_

- [ ] 16.2 Create ProjectForm component for project creation
  - Build project creation form with inheritance options
  - Add project number display and validation
  - Implement project description editing with inheritance
  - _Requirements: 5.1, 5.3_

- [ ] 16.3 Create ProjectDetails component with tender relationship
  - Build project detail view with project number prominently displayed
  - Display linked tender information and inheritance details
  - Add quick actions for project management and PO creation
  - _Requirements: 5.8_

- [ ] 16.4 Create TenderToProjectConverter component
  - Build tender-to-project conversion interface
  - Add conversion preview with inherited information
  - Implement conversion confirmation and validation
  - _Requirements: 5.1, 5.2_

- [ ]\* 16.5 Write component unit tests for project UI
  - Test all project components with various states
  - Test tender-to-project conversion interface
  - Test project inheritance and display logic
  - _Requirements: 5.1, 5.2, 5.5, 5.8_

- [ ] 17. Implement project management pages and workflows
  - Create Next.js pages for project management
  - Add tender-to-project conversion workflows
  - Implement responsive design for project management
  - _Requirements: 5.5, 5.8_

- [ ] 17.1 Create project management page with conversion
  - Build project listing with tender conversion options
  - Add project creation and editing workflows
  - Implement responsive design for project management
  - _Requirements: 5.5, 5.6_

- [ ] 17.2 Create project detail and management pages
  - Build project detail pages with full inheritance information
  - Add project editing and status management
  - Implement project-to-PO creation workflows
  - _Requirements: 5.8_

## Phase 6: Purchase Order Management (MVP)

- [ ] 18. Set up purchase order management database layer
  - Create database service functions for PO CRUD operations
  - Implement PO queries with project relationships
  - Add supplier name defaulting to organization name
  - _Requirements: 6.1, 6.2, 6.8_

- [ ] 18.1 Create purchase order repository with CRUD operations
  - Write PO creation with project relationship validation
  - Implement supplier name defaulting to organization name
  - Add PO read operations with project joins
  - Add PO update and soft deletion functionality
  - _Requirements: 6.1, 6.2, 6.7_

- [ ] 18.2 Implement purchase order search and filtering functionality
  - Create search across project number, supplier name, and description
  - Add filtering by project, supplier, and status
  - Implement sorting by creation date and amount
  - _Requirements: 6.6_

- [ ] 18.3 Create supplier name management system
  - Implement organization name as default supplier
  - Add custom supplier name override for outsourcing
  - Create supplier name validation and management
  - _Requirements: 6.1, 6.2_

- [ ]\* 18.4 Write unit tests for purchase order repository operations
  - Test all PO CRUD operations and validations
  - Test PO-project relationships and joins
  - Test supplier name defaulting and override logic
  - _Requirements: 6.1, 6.2, 6.6, 6.7, 6.8_

- [ ] 19. Create purchase order management API endpoints
  - Implement REST API endpoints for PO operations
  - Add project-based PO retrieval and management
  - Implement supplier name defaulting APIs
  - _Requirements: 6.1, 6.3, 6.6_

- [ ] 19.1 Implement purchase order CRUD API routes
  - Create GET /api/purchase-orders with project filtering
  - Create POST /api/purchase-orders for PO creation with supplier defaulting
  - Create PUT /api/purchase-orders/[id] for PO updates
  - Create DELETE /api/purchase-orders/[id] for soft deletion
  - _Requirements: 6.1, 6.2, 6.4, 6.7_

- [ ] 19.2 Implement purchase order search and project API routes
  - Create GET /api/projects/[id]/purchase-orders for project-based PO listing
  - Add PO search by project number and supplier name
  - Implement PO status update and management endpoints
  - _Requirements: 6.3, 6.6, 6.8_

- [ ]\* 19.3 Write API integration tests for purchase order endpoints
  - Test all PO API endpoints with authentication
  - Test project-PO relationships and supplier defaulting
  - Test search and filtering functionality
  - _Requirements: 6.1, 6.2, 6.3, 6.6, 6.7_

- [ ] 20. Build purchase order management UI components
  - Create responsive React components for PO management
  - Implement supplier name defaulting interface
  - Add project-based PO organization
  - _Requirements: 6.1, 6.5, 6.8_

- [ ] 20.1 Create PurchaseOrderList component with project organization
  - Build PO listing organized by project number
  - Add supplier name and amount display
  - Implement PO search and filtering by project
  - _Requirements: 6.5, 6.6_

- [ ] 20.2 Create PurchaseOrderForm component with supplier defaulting
  - Build PO creation form with project selection
  - Add supplier name field with organization name default
  - Implement supplier name override for outsourcing
  - Add description and amount input with validation
  - _Requirements: 6.1, 6.2, 6.3_

- [ ] 20.3 Create PurchaseOrderDetails component with project relationship
  - Build PO detail view with project information
  - Display supplier information and outsourcing status
  - Add quick actions for PO status updates
  - _Requirements: 6.8_

- [ ]\* 20.4 Write component unit tests for purchase order UI
  - Test all PO components with various states
  - Test supplier name defaulting and override logic
  - Test project-PO relationships in UI
  - _Requirements: 6.1, 6.2, 6.5, 6.8_

- [ ] 21. Implement purchase order management pages and workflows
  - Create Next.js pages for PO management
  - Add project-based PO organization and workflows
  - Implement responsive design for PO management
  - _Requirements: 6.5, 6.8_

- [ ] 21.1 Create purchase order management page with project focus
  - Build PO listing organized by project with creation options
  - Add PO creation and editing workflows
  - Implement responsive design for PO management
  - _Requirements: 6.5, 6.6_

- [ ] 21.2 Create purchase order detail and management pages
  - Build PO detail pages with full project and supplier information
  - Add PO editing and status management workflows
  - Implement PO history and tracking features
  - _Requirements: 6.8_
