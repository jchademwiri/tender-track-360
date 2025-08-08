# Phase 3: File Management - Document Repository Design

## Overview

The Document Repository feature enhances the basic file upload from Phase 1 with comprehensive document management capabilities. The design leverages UploadThing for secure file storage with organization-based folder structures and integrates with Better Auth for permission management.

## Architecture

### System Architecture

Building on Phases 1-2:

- **File Storage Layer**: UploadThing with organization-based folder structure
- **Document Service Layer**: Enhanced file management and version control
- **Permission Layer**: Document-level access control integrated with user roles
- **Search Layer**: Document indexing and search capabilities
- **Submission Layer**: Document preparation and submission workflows

### File Organization Strategy

**UploadThing Folder Structure:**

```
/organization-name/
  ├── tender-{id}/
  │   ├── tender-notice/
  │   ├── technical-specs/
  │   ├── financial-proposal/
  │   ├── legal-documents/
  │   ├── correspondence/
  │   └── submissions/
```

### Database Design

Extends existing schema with:

- **Document Metadata**: Enhanced document table with categories and versions
- **Document Permissions**: Access control for sensitive documents
- **Document Versions**: Version tracking and history
- **Submission Packages**: Document collections for tender submissions

## Components and Interfaces

### Core Services

#### DocumentService

```typescript
interface DocumentService {
  uploadDocument(file: File, metadata: DocumentMetadata): Promise<Document>;
  getDocument(id: string): Promise<Document | null>;
  listDocuments(
    tenderId: string,
    filters: DocumentFilters
  ): Promise<Document[]>;
  createVersion(parentId: string, file: File): Promise<Document>;
  deleteDocument(id: string): Promise<void>;
  moveDocument(id: string, newCategory: string): Promise<Document>;
}
```

#### DocumentPermissionService

```typescript
interface DocumentPermissionService {
  checkAccess(documentId: string, userId: string): Promise<boolean>;
  setPermissions(
    documentId: string,
    permissions: DocumentPermission[]
  ): Promise<void>;
  getUserAccessibleDocuments(
    userId: string,
    tenderId: string
  ): Promise<string[]>;
}
```

#### SubmissionService

```typescript
interface SubmissionService {
  createSubmissionPackage(tenderId: string): Promise<SubmissionPackage>;
  validateDocumentCompleteness(tenderId: string): Promise<ValidationResult>;
  generateSubmissionReport(tenderId: string): Promise<SubmissionReport>;
}
```

### React Components

#### DocumentManager

- Enhanced file upload with drag-and-drop
- Category selection and automatic suggestions
- File organization and folder navigation
- Bulk upload capabilities

#### DocumentViewer

- File preview for supported formats
- Version history display
- Download and sharing options
- Permission management interface

#### SubmissionPrep

- Document checklist for tender requirements
- Missing document indicators
- Submission package creation
- Document validation and review

## Data Models

### Enhanced Document Model

```typescript
interface Document {
  id: string;
  tenderId: string;
  parentDocumentId?: string; // For versions
  category: DocumentCategory;
  title: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadThingUrl: string;
  uploadThingKey: string;
  version: number;
  isLatestVersion: boolean;
  description?: string;
  tags: string[];
  permissions: DocumentPermission[];
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### DocumentPermission Model

```typescript
interface DocumentPermission {
  id: string;
  documentId: string;
  userId?: string;
  roleId?: string;
  permissionType: 'read' | 'write' | 'delete';
  grantedBy: string;
  grantedAt: Date;
}
```

### SubmissionPackage Model

```typescript
interface SubmissionPackage {
  id: string;
  tenderId: string;
  documents: Document[];
  createdAt: Date;
  createdBy: string;
  status: 'draft' | 'ready' | 'submitted';
  submissionNotes?: string;
}
```

## Integration Points

### UploadThing Integration

- Organization-based folder structure
- File upload with progress tracking
- Secure file access with signed URLs
- File deletion and management

### Better Auth Integration

- Role-based document permissions
- User authentication for file access
- Permission inheritance from tender assignments
- Audit logging for document access

## File Management Features

### Version Control

- Automatic version creation for duplicate filenames
- Version history with diff indicators
- Rollback capabilities to previous versions
- Version comparison tools

### Search and Discovery

- Full-text search across document metadata
- Category and tag-based filtering
- Date range and user-based searches
- Saved search preferences

### Submission Workflows

- Document requirement checklists
- Automated validation of document completeness
- Submission package generation
- Final review and approval processes
