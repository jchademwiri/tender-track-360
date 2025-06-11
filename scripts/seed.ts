import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../src/db/schema';
import { sql } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set in environment variables');
}

const sqlClient = postgres(connectionString, { max: 1 });
const db = drizzle(sqlClient, { schema });

async function seed() {
  console.log('🌱 Starting seeding...');

  try {
    // Clean existing data
    await sqlClient`TRUNCATE TABLE users, user_preferences, tender_categories, clients, tenders, 
             documents, tasks, reminder_rules, notifications, activity_logs, allowed_status_transitions CASCADE;`;

    // Seed Users
    const users = await db.insert(schema.users).values([
      {
        id: '11111111-1111-1111-1111-111111111111',
        email: 'admin@tendertrack.com',
        fullName: 'System Administrator',
        role: 'admin',
        department: 'Administration',
        isActive: true,
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        email: 'manager1@tendertrack.com',
        fullName: 'Jane Smith',
        role: 'tender_manager',
        department: 'Procurement',
        isActive: true,
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        email: 'manager2@tendertrack.com',
        fullName: 'John Doe',
        role: 'tender_manager',
        department: 'Finance',
        isActive: true,
      },
      {
        id: '44444444-4444-4444-4444-444444444444',
        email: 'viewer1@tendertrack.com',
        fullName: 'Sarah Wilson',
        role: 'viewer',
        department: 'Legal',
        isActive: true,
      },
    ]).returning();

    // Seed User Preferences
    await db.insert(schema.userPreferences).values(
      users.map(user => ({
        userId: user.id,
        emailNotifications: true,
        reminderDays: 7,
        timezone: 'UTC',
      }))
    );

    // Seed Tender Categories
    const categories = await db.insert(schema.tenderCategories).values([
      {
        id: 'a1111111-1111-1111-1111-111111111111',
        name: 'Construction',
        description: 'Building and infrastructure projects',
      },
      {
        id: 'a2222222-2222-2222-2222-222222222222',
        name: 'IT Services',
        description: 'Technology and software services',
      },
      {
        id: 'a3333333-3333-3333-3333-333333333333',
        name: 'Consulting',
        description: 'Professional consulting services',
      },
      {
        id: 'a4444444-4444-4444-4444-444444444444',
        name: 'Supplies',
        description: 'Office and general supplies',
      },
    ]).returning();

    // Seed Clients
    const clients = await db.insert(schema.clients).values([
      {
        id: 'b1111111-1111-1111-1111-111111111111',
        name: 'Ministry of Education',
        type: 'government',
        contactPerson: 'Michael Brown',
        contactEmail: 'contact@moe.gov',
        contactPhone: '+1234567890',
        createdById: users[0].id,
      },
      {
        id: 'b2222222-2222-2222-2222-222222222222',
        name: 'Tech Solutions Corp',
        type: 'private',
        contactPerson: 'Lisa Johnson',
        contactEmail: 'lisa@techsolutions.com',
        contactPhone: '+1234567891',
        createdById: users[0].id,
      },
      {
        id: 'b3333333-3333-3333-3333-333333333333',
        name: 'World Health Organization',
        type: 'international',
        contactPerson: 'David Miller',
        contactEmail: 'david@who.int',
        contactPhone: '+1234567892',
        createdById: users[0].id,
      },
    ]).returning();

    // Seed Tenders
    const tenders = await db.insert(schema.tenders).values([
      {
        id: 'c1111111-1111-1111-1111-111111111111',
        referenceNumber: 'TEN-2025-001',
        title: 'School Building Construction',
        description: 'Construction of new school building with 20 classrooms',
        clientId: clients[0].id,
        categoryId: categories[0].id,
        status: 'published',
        publicationDate: sql`${new Date('2025-06-10').toISOString()}::date`,
        submissionDeadline: sql`${new Date('2025-08-15T23:59:59Z').toISOString()}::timestamptz`,
        estimatedValue: sql`1000000.00`,
        createdById: users[1].id,
        updatedById: users[1].id,
      },
      {
        id: 'c2222222-2222-2222-2222-222222222222',
        referenceNumber: 'TEN-2025-002',
        title: 'IT Infrastructure Upgrade',
        description: 'Comprehensive upgrade of network and server infrastructure',
        clientId: clients[1].id,
        categoryId: categories[1].id,
        status: 'draft',
        publicationDate: sql`${new Date('2025-06-15').toISOString()}::date`,
        submissionDeadline: sql`${new Date('2025-09-01T23:59:59Z').toISOString()}::timestamptz`,
        estimatedValue: sql`500000.00`,
        createdById: users[1].id,
        updatedById: users[1].id,
      },
      {
        id: 'c3333333-3333-3333-3333-333333333333',
        referenceNumber: 'TEN-2025-003',
        title: 'Medical Equipment Supply',
        description: 'Supply of advanced medical diagnostic equipment',
        clientId: clients[2].id,
        categoryId: categories[3].id,
        status: 'published',
        publicationDate: sql`${new Date('2025-06-12').toISOString()}::date`,
        submissionDeadline: sql`${new Date('2025-08-30T23:59:59Z').toISOString()}::timestamptz`,
        estimatedValue: sql`750000.00`,
        createdById: users[2].id,
        updatedById: users[2].id,
      },
      {
        id: 'c4444444-4444-4444-4444-444444444444',
        referenceNumber: 'TEN-2025-004',
        title: 'Healthcare Consulting Services',
        description: 'Strategic consulting for healthcare operations optimization',
        clientId: clients[2].id,
        categoryId: categories[2].id,
        status: 'evaluation',
        publicationDate: sql`${new Date('2025-05-01').toISOString()}::date`,
        submissionDeadline: sql`${new Date('2025-06-01T23:59:59Z').toISOString()}::timestamptz`,
        estimatedValue: sql`300000.00`,
        createdById: users[1].id,
        updatedById: users[1].id,
      },
      {
        id: 'c5555555-5555-5555-5555-555555555555',
        referenceNumber: 'TEN-2025-005',
        title: 'Office Renovation Project',
        description: 'Complete renovation of government office building',
        clientId: clients[0].id,
        categoryId: categories[0].id,
        status: 'in_progress',
        publicationDate: sql`${new Date('2025-06-05').toISOString()}::date`,
        submissionDeadline: sql`${new Date('2025-07-15T23:59:59Z').toISOString()}::timestamptz`,
        estimatedValue: sql`450000.00`,
        createdById: users[2].id,
        updatedById: users[2].id,
      },
      {
        id: 'c6666666-6666-6666-6666-666666666666',
        referenceNumber: 'TEN-2025-006',
        title: 'Software Development Services',
        description: 'Development of custom enterprise software solution',
        clientId: clients[1].id,
        categoryId: categories[1].id,
        status: 'submitted',
        publicationDate: sql`${new Date('2025-05-15').toISOString()}::date`,
        submissionDeadline: sql`${new Date('2025-06-30T23:59:59Z').toISOString()}::timestamptz`,
        estimatedValue: sql`600000.00`,
        createdById: users[1].id,
        updatedById: users[1].id,
      },
      {
        id: 'c7777777-7777-7777-7777-777777777777',
        referenceNumber: 'TEN-2025-007',
        title: 'Office Supplies Contract',
        description: 'Annual contract for office supplies and stationery',
        clientId: clients[0].id,
        categoryId: categories[3].id,
        status: 'published',
        publicationDate: sql`${new Date('2025-06-20').toISOString()}::date`,
        submissionDeadline: sql`${new Date('2025-07-20T23:59:59Z').toISOString()}::timestamptz`,
        estimatedValue: sql`100000.00`,
        createdById: users[2].id,
        updatedById: users[2].id,
      },
      {
        id: 'c8888888-8888-8888-8888-888888888888',
        referenceNumber: 'TEN-2025-008',
        title: 'Security System Implementation',
        description: 'Installation of advanced security systems',
        clientId: clients[1].id,
        categoryId: categories[1].id,
        status: 'draft',
        publicationDate: sql`${new Date('2025-07-01').toISOString()}::date`,
        submissionDeadline: sql`${new Date('2025-08-15T23:59:59Z').toISOString()}::timestamptz`,
        estimatedValue: sql`250000.00`,
        createdById: users[1].id,
        updatedById: users[1].id,
      },
      {
        id: 'c9999999-9999-9999-9999-999999999999',
        referenceNumber: 'TEN-2025-009',
        title: 'Training Program Development',
        description: 'Development of employee training programs',
        clientId: clients[2].id,
        categoryId: categories[2].id,
        status: 'published',
        publicationDate: sql`${new Date('2025-06-25').toISOString()}::date`,
        submissionDeadline: sql`${new Date('2025-08-01T23:59:59Z').toISOString()}::timestamptz`,
        estimatedValue: sql`150000.00`,
        createdById: users[2].id,
        updatedById: users[2].id,
      },
      {
        id: 'caaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        referenceNumber: 'TEN-2025-010',
        title: 'Laboratory Equipment Supply',
        description: 'Supply of specialized laboratory equipment',
        clientId: clients[2].id,
        categoryId: categories[3].id,
        status: 'evaluation',
        publicationDate: sql`${new Date('2025-05-10').toISOString()}::date`,
        submissionDeadline: sql`${new Date('2025-06-10T23:59:59Z').toISOString()}::timestamptz`,
        estimatedValue: sql`800000.00`,
        createdById: users[1].id,
        updatedById: users[1].id,
      },
      {
        id: 'cbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        referenceNumber: 'TEN-2025-011',
        title: 'Waste Management Services',
        description: 'City-wide waste management and recycling services',
        clientId: clients[0].id,
        categoryId: categories[2].id,
        status: 'published',
        publicationDate: sql`${new Date('2025-06-30').toISOString()}::date`,
        submissionDeadline: sql`${new Date('2025-08-30T23:59:59Z').toISOString()}::timestamptz`,
        estimatedValue: sql`900000.00`,
        createdById: users[2].id,
        updatedById: users[2].id,
      },
      {
        id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
        referenceNumber: 'TEN-2025-012',
        title: 'Cloud Migration Project',
        description: 'Migration of legacy systems to cloud infrastructure',
        clientId: clients[1].id,
        categoryId: categories[1].id,
        status: 'in_progress',
        publicationDate: sql`${new Date('2025-05-20').toISOString()}::date`,
        submissionDeadline: sql`${new Date('2025-07-01T23:59:59Z').toISOString()}::timestamptz`,
        estimatedValue: sql`400000.00`,
        createdById: users[1].id,
        updatedById: users[1].id,
      },
      {
        id: 'cddddddd-dddd-dddd-dddd-dddddddddddd',
        referenceNumber: 'TEN-2025-013',
        title: 'Research Equipment Supply',
        description: 'Supply of research and development equipment',
        clientId: clients[2].id,
        categoryId: categories[3].id,
        status: 'draft',
        publicationDate: sql`${new Date('2025-07-05').toISOString()}::date`,
        submissionDeadline: sql`${new Date('2025-08-20T23:59:59Z').toISOString()}::timestamptz`,
        estimatedValue: sql`550000.00`,
        createdById: users[2].id,
        updatedById: users[2].id,
      },
      {
        id: 'ceeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
        referenceNumber: 'TEN-2025-014',
        title: 'Hospital Renovation',
        description: 'Renovation of major hospital wing',
        clientId: clients[2].id,
        categoryId: categories[0].id,
        status: 'published',
        publicationDate: sql`${new Date('2025-06-15').toISOString()}::date`,
        submissionDeadline: sql`${new Date('2025-08-15T23:59:59Z').toISOString()}::timestamptz`,
        estimatedValue: sql`1200000.00`,
        createdById: users[1].id,
        updatedById: users[1].id,
      },
      {
        id: 'cf111111-ffff-ffff-ffff-ffffffffffff',
        referenceNumber: 'TEN-2025-015',
        title: 'Green Energy Implementation',
        description: 'Implementation of solar energy systems in government buildings',
        clientId: clients[0].id,
        categoryId: categories[0].id,
        status: 'published',
        publicationDate: sql`${new Date('2025-06-20').toISOString()}::date`,
        submissionDeadline: sql`${new Date('2025-08-25T23:59:59Z').toISOString()}::timestamptz`,
        estimatedValue: sql`950000.00`,
        createdById: users[2].id,
        updatedById: users[2].id,
      }
    ]).returning();

    // Seed Documents
    await db.insert(schema.documents).values([
      {
        id: 'd1111111-1111-1111-1111-111111111111',
        tenderId: tenders[0].id,
        category: 'tender_notice',
        title: 'Tender Notice - School Building',
        fileName: 'tender-notice.pdf',
        fileSize: 1024000,
        mimeType: 'application/pdf',
        storageUrl: 'https://storage.example.com/documents/tender-notice.pdf',
        version: 1,
        uploadedById: users[1].id,
      },
    ]);

    // Seed Tasks
    await db.insert(schema.tasks).values([
      {
        id: 'e1111111-1111-1111-1111-111111111111',
        tenderId: tenders[0].id,
        title: 'Review Technical Specifications',
        description: 'Complete review of technical specifications document',
        assignedToId: users[2].id,
        dueDate: sql`${new Date('2025-06-20T17:00:00Z').toISOString()}::timestamptz`,
        priority: 1,
        createdById: users[1].id,
      },
    ]);

    // Seed Reminder Rules
    await db.insert(schema.reminderRules).values([
      {
        id: 'f1111111-1111-1111-1111-111111111111',
        name: 'Submission Deadline Warning',
        daysBefore: 7,
        messageTemplate: 'Tender {tender_reference} submission deadline is in 7 days',
      },
    ]);

    // Seed Status Transitions
    await db.insert(schema.allowedStatusTransitions).values([
      {
        fromStatus: 'draft',
        toStatus: 'published',
        requiredRole: 'admin',
      },
      {
        fromStatus: 'published',
        toStatus: 'in_progress',
        requiredRole: 'tender_manager',
      },
      {
        fromStatus: 'in_progress',
        toStatus: 'submitted',
        requiredRole: 'tender_manager',
      },
      {
        fromStatus: 'submitted',
        toStatus: 'evaluation',
        requiredRole: 'admin',
      },
    ]);

    console.log('✅ Seeding completed successfully');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;  } finally {
    await db.end();
    await sqlClient.end();
  }
}

seed().catch((err) => {
  console.error('Failed to seed database:', err);
  process.exit(1);
});