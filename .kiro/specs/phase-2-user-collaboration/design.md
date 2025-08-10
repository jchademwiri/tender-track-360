# Phase 2: Team Features - User Collaboration Design

## Overview

The User Collaboration feature builds upon Phase 1 to add essential team functionality. This phase focuses on user assignments, basic task management, and role-based access control using Better Auth's built-in capabilities.

## Architecture

### System Architecture

Building on Phase 1 foundation:

- **Authentication Layer**: Better Auth with enhanced role management
- **Permission Layer**: Role-based access control with tender assignments
- **Task Management Layer**: Basic task creation and assignment
- **Activity Layer**: Simple activity logging for audit trails
- **Notification Layer**: Basic in-app notifications for assignments

### Database Design

Extends Phase 1 schema with:

- **Tender Assignments**: Junction table linking users to tenders
- **Tasks Table**: Basic task management with assignments
- **Activity Logs**: Simple activity tracking
- **User Roles**: Enhanced role management through Better Auth

## Components and Interfaces

### Core Services

#### TeamManagementService

```typescript
interface TeamManagementService {
  assignUserToTender(tenderId: string, userId: string): Promise<void>;
  removeUserFromTender(tenderId: string, userId: string): Promise<void>;
  getTenderTeam(tenderId: string): Promise<User[]>;
  getUserTenders(userId: string): Promise<Tender[]>;
}
```

#### TaskService

```typescript
interface TaskService {
  createTask(task: CreateTaskRequest): Promise<Task>;
  assignTask(taskId: string, userId: string): Promise<Task>;
  updateTaskStatus(taskId: string, status: TaskStatus): Promise<Task>;
  getUserTasks(userId: string): Promise<Task[]>;
}
```

### React Components

#### TeamAssignment

- User selection for tender assignments
- Team member list with roles
- Assignment and removal functionality

#### TaskBoard

- Simple task list with status indicators
- Task creation and assignment forms
- Basic progress tracking

#### ActivityFeed

- Chronological activity timeline
- Basic filtering by user and action type
- Simple activity summaries

## Data Models

### TenderAssignment Model

```typescript
interface TenderAssignment {
  id: string;
  tenderId: string;
  userId: string;
  assignedAt: Date;
  assignedBy: string;
  isActive: boolean;
}
```

### Task Model

```typescript
interface Task {
  id: string;
  tenderId: string;
  title: string;
  description?: string;
  assignedTo?: string;
  status: 'pending' | 'in_progress' | 'completed';
  dueDate?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### ActivityLog Model

```typescript
interface ActivityLog {
  id: string;
  tenderId: string;
  userId: string;
  action: string;
  details: string;
  timestamp: Date;
}
```
