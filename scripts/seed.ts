import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@/db/schema';
// import * as schema from '../src/db/schema';
import { sql } from 'drizzle-orm';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';

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
    const users = await db
      .insert(schema.users)
      .values([
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
      ])
      .returning();

    // Seed User Preferences
    await db.insert(schema.userPreferences).values(
      users.map((user) => ({
        userId: user.id,
        emailNotifications: true,
        reminderDays: 7,
        timezone: 'UTC',
      }))
    );

    // Seed Tender Categories
    const categories = await db
      .insert(schema.tenderCategories)
      .values([
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
      ])
      .returning();

    // Seed Clients
    const clients = await db
      .insert(schema.clients)
      .values([
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
      ])
      .returning();

    // Add new clients
    const extraClients = await db
      .insert(schema.clients)
      .values([
        {
          id: 'b4444444-4444-4444-4444-444444444444',
          name: 'City of Tshwane',
          type: 'government',
          contactPerson: 'Sipho Mokoena',
          contactEmail: 'sipho@tshwane.gov.za',
          contactPhone: '+27123456789',
          createdById: users[0].id,
        },
        {
          id: 'b5555555-5555-5555-5555-555555555555',
          name: 'City of Ekurhuleni',
          type: 'government',
          contactPerson: 'Thandi Nkosi',
          contactEmail: 'thandi@ekurhuleni.gov.za',
          contactPhone: '+27129876543',
          createdById: users[0].id,
        },
        {
          id: 'b6666666-6666-6666-6666-666666666666',
          name: 'Pikitup',
          type: 'government',
          contactPerson: 'Jabu Dlamini',
          contactEmail: 'jabu@pikitup.co.za',
          contactPhone: '+27123459876',
          createdById: users[0].id,
        },
        {
          id: 'b7777777-7777-7777-7777-777777777777',
          name: 'Mbombela',
          type: 'government',
          contactPerson: 'Nomsa Khumalo',
          contactEmail: 'nomsa@mbombela.gov.za',
          contactPhone: '+27123451234',
          createdById: users[0].id,
        },
        {
          id: 'b8888888-8888-8888-8888-888888888888',
          name: 'Msunduzi',
          type: 'government',
          contactPerson: 'Sibusiso Zulu',
          contactEmail: 'sibusiso@msunduzi.gov.za',
          contactPhone: '+27331234567',
          createdById: users[0].id,
        },
      ])
      .returning();
    const allClients = [...clients, ...extraClients];

    // Helper to generate random date between two years
    function randomDate(yearStart: number, yearEnd: number): Date {
      const start = new Date(`${yearStart}-01-01`).getTime();
      const end = new Date(`${yearEnd}-12-31`).getTime();
      return new Date(start + Math.random() * (end - start));
    }

    // Generate 25 submitted tenders, 10 rejected, and the rest (to 40) with other statuses
    const validStatuses: (
      | 'open'
      | 'closed'
      | 'evaluation'
      | 'awarded'
      | 'cancelled'
    )[] = ['open', 'closed', 'evaluation', 'awarded', 'cancelled'];
    const tenderStatuses: (
      | 'open'
      | 'closed'
      | 'submitted'
      | 'evaluation'
      | 'awarded'
      | 'cancelled'
      | 'rejected'
    )[] = [...Array(25).fill('submitted'), ...Array(10).fill('rejected')];
    for (let i = tenderStatuses.length; i < 40; i++) {
      tenderStatuses.push(validStatuses[(i - 35) % validStatuses.length]);
    }

    // Generate tenders
    const tendersToInsert = tenderStatuses.map((status, i) => {
      const year = 2020 + (i % 6); // 2020-2025
      const pubDate = randomDate(year, year);
      const submDate = new Date(
        pubDate.getTime() + 1000 * 60 * 60 * 24 * (30 + (i % 30))
      );
      const client = allClients[i % allClients.length];
      const category = categories[i % categories.length];
      const user = users[i % users.length];
      return {
        id: randomUUID(),
        referenceNumber: `TEN-${year}-${(i + 1).toString().padStart(3, '0')}`,
        title: `${status.charAt(0).toUpperCase() + status.slice(1)} Tender ${
          i + 1
        }`,
        description: `Auto-generated tender for ${status} status, year ${year}`,
        clientId: client.id,
        categoryId: category.id,
        status,
        publicationDate: sql`${pubDate.toISOString().slice(0, 10)}::date`,
        submissionDeadline: sql`${submDate.toISOString()}::timestamptz`,
        estimatedValue: sql`${(100000 + i * 10000).toFixed(2)}`,
        createdById: user.id,
        updatedById: user.id,
      };
    });

    await db.insert(schema.tenders).values(tendersToInsert);

    // Seed Documents
    await db.insert(schema.documents).values([
      {
        id: 'd1111111-1111-1111-1111-111111111111',
        tenderId: tendersToInsert[0].id,
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
        tenderId: tendersToInsert[0].id,
        title: 'Review Technical Specifications',
        description: 'Complete review of technical specifications document',
        assignedToId: users[2].id,
        dueDate: sql`${new Date(
          '2025-06-20T17:00:00Z'
        ).toISOString()}::timestamptz`,
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
        messageTemplate:
          'Tender {tender_reference} submission deadline is in 7 days',
      },
    ]);

    // Fix status transitions to use only valid enum values
    await db.insert(schema.allowedStatusTransitions).values([
      {
        fromStatus: 'open',
        toStatus: 'submitted',
        requiredRole: 'tender_manager',
      },
      {
        fromStatus: 'submitted',
        toStatus: 'evaluation',
        requiredRole: 'admin',
      },
      { fromStatus: 'evaluation', toStatus: 'awarded', requiredRole: 'admin' },
      { fromStatus: 'evaluation', toStatus: 'rejected', requiredRole: 'admin' },
      { fromStatus: 'open', toStatus: 'cancelled', requiredRole: 'admin' },
      { fromStatus: 'submitted', toStatus: 'cancelled', requiredRole: 'admin' },
      {
        fromStatus: 'evaluation',
        toStatus: 'cancelled',
        requiredRole: 'admin',
      },
    ]);

    console.log('✅ Seeding completed successfully');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

seed().catch((err) => {
  console.error('Failed to seed database:', err);
  process.exit(1);
});
