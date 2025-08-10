# Database Utilities

This directory contains utility functions for common database operations in Tender Track 360.

## Category Management (`category-helpers.ts`)

### Features

- **System Default Categories**: 12 predefined categories available to all organizations
- **Organization-Specific Categories**: Custom categories that organizations can create
- **Efficient Querying**: Optimized indexes for fast category lookups

### Available Functions

#### `getAvailableCategories(organizationId: string)`

Returns all categories available to an organization (system defaults + organization-specific).

#### `getSystemDefaultCategories()`

Returns only the system default categories.

#### `getOrganizationCategories(organizationId: string)`

Returns only organization-specific categories.

#### `createOrganizationCategory(organizationId: string, categoryData)`

Creates a new organization-specific category.

#### `categoryNameExists(organizationId: string, name: string, excludeId?: string)`

Checks if a category name already exists for an organization.

### System Default Categories

1. Construction & Infrastructure
2. Information Technology
3. Professional Services
4. Healthcare & Medical
5. Education & Training
6. Transportation & Logistics
7. Energy & Utilities
8. Security & Defense
9. Agriculture & Food
10. Environmental Services
11. Manufacturing & Industrial
12. Research & Development

## Client Management (`client-helpers.ts`)

### Features

- **Organization Isolation**: All clients are scoped to specific organizations
- **Soft Deletes**: Clients are soft-deleted to maintain audit trails
- **Search Functionality**: Search clients by name, contact person, or email
- **Type Classification**: Support for different client types (government, private, etc.)

### Available Functions

#### `getOrganizationClients(organizationId: string)`

Returns all active clients for an organization.

#### `getClientById(organizationId: string, clientId: string)`

Gets a specific client by ID within an organization.

#### `searchClients(organizationId: string, searchTerm: string)`

Searches clients by name or contact information.

#### `createClient(organizationId: string, createdById: string, clientData)`

Creates a new client for an organization.

#### `updateClient(organizationId: string, clientId: string, updates)`

Updates an existing client.

#### `deleteClient(organizationId: string, clientId: string, deletedById: string)`

Soft deletes a client.

#### `clientNameExists(organizationId: string, name: string, excludeId?: string)`

Checks if a client name already exists in the organization.

### Client Types

- `government`: Government agencies and departments
- `parastatal`: State-owned enterprises
- `private`: Private companies and corporations
- `ngo`: Non-governmental organizations
- `international`: International organizations
- `other`: Other types of clients

## Database Seeding

### Running Seeds

```bash
npx tsx scripts/seed-database.ts
```

### Available Seeds

- **Default Categories**: Seeds the 12 system default tender categories

## Performance Optimizations

### Indexes

Both clients and categories tables include optimized indexes:

#### Categories Table

- `idx_categories_organization`: Organization-based queries
- `idx_categories_system`: System default filtering
- `idx_categories_name`: Name-based searches
- `idx_categories_org_active`: Organization + active status composite
- `idx_categories_system_active`: System defaults + active status composite

#### Clients Table

- `idx_clients_organization_id`: Organization-based queries
- `idx_clients_name`: Name-based searches
- `idx_clients_type`: Type-based filtering
- `idx_clients_org_active`: Organization + active status composite
- `idx_clients_created_by`: Created by user queries

## Better Auth Integration

Both tables are fully integrated with Better Auth:

- **Text-based IDs**: All foreign keys use text type to match Better Auth user/organization IDs
- **Organization Isolation**: All data is scoped to Better Auth organizations
- **User Attribution**: All operations track which Better Auth user performed them

## Usage Examples

### Categories

```typescript
import {
  getAvailableCategories,
  createOrganizationCategory,
} from '@/db/utils/category-helpers';

// Get all categories for an organization
const categories = await getAvailableCategories('org-123');

// Create a custom category
const newCategory = await createOrganizationCategory('org-123', {
  name: 'Custom Engineering',
  description: 'Specialized engineering services',
});
```

### Clients

```typescript
import {
  getOrganizationClients,
  createClient,
  searchClients,
} from '@/db/utils/client-helpers';

// Get all clients
const clients = await getOrganizationClients('org-123');

// Create a new client
const newClient = await createClient('org-123', 'user-456', {
  name: 'ACME Corporation',
  type: 'private',
  contactPerson: 'John Smith',
  contactEmail: 'john@acme.com',
});

// Search clients
const results = await searchClients('org-123', 'ACME');
```
