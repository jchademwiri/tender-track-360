# Wireframes

## Overview
This document outlines the key screens and interfaces for Tender Track 360. These wireframes serve as a blueprint for the application's user interface, focusing on layout, information hierarchy, and user flows rather than visual design details.

## Global Layout

### Base Layout Structure
- **Header**
  - App logo (left)
  - Global search (center)
  - Notifications bell (right)
  - User profile menu (right)
- **Sidebar Navigation**
  - Dashboard
  - Tenders
  - Clients
  - Documents
  - Tasks
  - Reports
  - User Management (admin only)
  - Settings
- **Main Content Area**
  - Page header with title and actions
  - Breadcrumb navigation
  - Page-specific content
- **Footer**
  - Copyright information
  - Version number
  - Help links

## Key Screens

### 1. Dashboard

**Purpose:** Provide an overview of tender activity and key metrics.

**Layout:**
- **Top Row:** Key metrics in card format
  - Active Tenders
  - Approaching Deadlines
  - Pending Tasks
  - Success Rate
- **Middle Row:** Charts and graphs
  - Tender Status Distribution (pie chart)
  - Timeline of Upcoming Deadlines (gantt-style chart)
- **Bottom Row:** Two columns
  - Recent Activity (left column)
  - Quick Actions (right column)

**Interactions:**
- Click on metrics to filter dashboard
- Hover on chart elements to see detailed information
- Click on activities to navigate to relevant tender/task

### 2. Tenders List

**Purpose:** Browse, search, and filter all tenders.

**Layout:**
- **Filters Area:** 
  - Search bar
  - Filter dropdowns (Status, Client, Date Range)
  - Sort options
  - View toggle (table/card view)
- **Action Button:** "+ New Tender" (top right)
- **Table View:**
  - Columns: Reference, Title, Client, Status, Submission Date, Assigned To, Actions
  - Sortable headers
  - Pagination controls
- **Card View:**
  - Grid of tender cards
  - Each card showing key information
  - Status color indicator
  - Quick action buttons

**Interactions:**
- Click row/card to view tender details
- Action column with ellipsis menu (Edit, Delete, Change Status)
- Bulk selection for actions on multiple tenders

### 3. Tender Creation Form

**Purpose:** Allow users to create new tender records.

**Layout:**
- **Multi-step form:**
  - Step 1: Basic Information
  - Step 2: Dates & Requirements
  - Step 3: Team & Documents
  - Step 4: Review & Submit
- **Progress Indicator:** Showing current step and completion status
- **Form Fields (Step 1):**
  - Reference Number*
  - Title*
  - Client (dropdown)*
  - Description (rich text)
  - Estimated Value
  - Department
- **Form Fields (Step 2):**
  - Publication Date (datepicker)
  - Submission Deadline* (datepicker with time)
  - Evaluation Date (datepicker)
  - Award Date (datepicker)
  - Custom Fields (dynamic)
- **Form Fields (Step 3):**
  - Team Members (multi-select)
  - Document Upload
  - Document Category Dropdown
- **Form Fields (Step 4):**
  - Summary of all entered information
  - Terms acknowledgment checkbox

**Interactions:**
- Next/Previous buttons for navigation between steps
- Save Draft button
- Form validation with inline error messages
- Auto-save functionality

### 4. Tender Details

**Purpose:** Display comprehensive information about a specific tender.

**Layout:**
- **Header:**
  - Title and Reference Number
  - Status Badge
  - Action Buttons (Edit, Delete, Change Status)
- **Tab Navigation:**
  - Overview
  - Documents
  - Tasks
  - Team
  - Activity Log
- **Overview Tab:**
  - Two-column layout for tender details
  - Key dates with countdown indicators
  - Client information card
  - Notes section
- **Documents Tab:**
  - Table of documents with version history
  - Upload button
  - Filter by category
- **Tasks Tab:**
  - Task list with completion status
  - Assignee information
  - Due dates
  - "Add Task" button
- **Team Tab:**
  - List of team members assigned to the tender
  - Roles and responsibilities
  - "Add Member" button
- **Activity Log Tab:**
  - Chronological list of all actions
  - Filter by action type or user

**Interactions:**
- Status change dropdown
- Document preview on click
- Inline task completion
- Comment/note addition

### 5. Client Management

**Purpose:** Manage client organizations that issue tenders.

**Layout:**
- **Filters Area:**
  - Search bar
  - Filter by client type
  - Sort options
- **Action Button:** "+ New Client" (top right)
- **Table View:**
  - Columns: Name, Type, Contact Person, Contact Info, Active Status, Actions
  - Sortable headers
  - Pagination controls

**Interactions:**
- Click row to view client details
- Action column with edit and delete options
- Toggle active status

### 6. Client Creation/Edit Form

**Purpose:** Add or modify client information.

**Layout:**
- **Form Fields:**
  - Name*
  - Client Type* (dropdown)
  - Contact Person
  - Contact Email
  - Contact Phone
  - Address (with optional map integration)
  - Website
  - Description
  - Active Status toggle

**Interactions:**
- Form validation with inline errors
- Save button (disabled until required fields complete)
- Cancel button

### 7. Document Repository

**Purpose:** Centralized view of all documents across tenders.

**Layout:**
- **Filters Area:**
  - Search bar
  - Filter by tender, category, upload date
  - Sort options
- **View Toggle:** Grid/List view
- **Grid View:**
  - Document cards with thumbnail/icon
  - Document title and category
  - Associated tender
  - Upload date and user
- **List View:**
  - Table with columns for document details
  - Quick actions (download, delete)

**Interactions:**
- Preview documents on click
- Download action
- Delete with confirmation
- Version history viewing

### 8. User Management (Admin)

**Purpose:** Administer system users and their permissions.

**Layout:**
- **Filters Area:**
  - Search bar
  - Filter by role, department, active status
- **Action Button:** "+ Add User" (top right)
- **Users Table:**
  - Columns: Name, Email, Role, Department, Last Login, Status, Actions
  - Sortable headers
  - Pagination controls

**Interactions:**
- Edit user details
- Activate/deactivate users
- Reset password function
- Role assignment

### 9. Reports & Analytics

**Purpose:** Generate insights from tender data.

**Layout:**
- **Report Selection:** Sidebar with report types
  - Tender Performance
  - Success Rate Analysis
  - Deadline Compliance
  - User Activity
  - Custom Reports
- **Filters Area:**
  - Date range picker
  - Department filter
  - Client filter
- **Visualization Area:**
  - Charts and graphs relevant to selected report
  - Table of supporting data
- **Export Options:** PDF, Excel, CSV buttons

**Interactions:**
- Parameter adjustment for reports
- Drill-down functionality in charts
- Export formatted reports
- Save report configurations

### 10. Settings

**Purpose:** Configure system-wide preferences.

**Layout:**
- **Navigation Tabs:**
  - General Settings
  - Notification Settings
  - Custom Fields
  - Integrations
  - System Logs
- **General Settings:**
  - Company Information
  - Date/Time Format
  - Default Currency
- **Notification Settings:**
  - Email Notification Preferences
  - In-app Notification Preferences
  - Reminder Thresholds
- **Custom Fields:**
  - List of defined custom fields
  - Add/Edit/Delete custom fields
  - Field type configurations

**Interactions:**
- Save settings button
- Test notification button
- Custom field type selection

## Mobile Adaptations

### Mobile Dashboard
- Stack all cards vertically
- Simplified charts optimized for mobile viewing
- Swipeable content for different metrics

### Mobile Tender List
- Card view only (no table view)
- Simplified filters via expandable filter panel
- Pull-to-refresh functionality

### Mobile Forms
- Single field focus with progressive disclosure
- Step indicators as numbered dots
- Simplified date pickers and input methods

*This document is part of the Tender Track 360 project documentation.*