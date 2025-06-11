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
    throw error;
  } finally {
    await sqlClient.end();
  }
}

seed().catch((err) => {
  console.error('Failed to seed database:', err);
  process.exit(1);
});