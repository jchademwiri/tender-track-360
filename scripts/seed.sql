-- Seed data for Tender Track 360
-- Reset sequences and clean existing data (if any)
TRUNCATE TABLE users, user_preferences, tender_categories, clients, tenders, documents, tasks, reminder_rules, notifications, activity_logs, custom_fields CASCADE;

-- Insert Users
INSERT INTO users (id, email, full_name, role, department, is_active, profile_image_url)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin@tendertrack.com', 'System Administrator', 'admin', 'Administration', true, NULL),
  ('22222222-2222-2222-2222-222222222222', 'officer1@tendertrack.com', 'Jane Smith', 'tender_officer', 'Procurement', true, NULL),
  ('33333333-3333-3333-3333-333333333333', 'officer2@tendertrack.com', 'John Doe', 'tender_officer', 'Finance', true, NULL),
  ('44444444-4444-4444-4444-444444444444', 'viewer1@tendertrack.com', 'Sarah Wilson', 'viewer', 'Legal', true, NULL);

-- Insert User Preferences
INSERT INTO user_preferences (id, user_id, email_notifications, reminder_days, timezone)
VALUES
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', true, 7, 'UTC'),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', true, 5, 'UTC'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', true, 3, 'UTC'),
  (gen_random_uuid(), '44444444-4444-4444-4444-444444444444', true, 7, 'UTC');

-- Insert Tender Categories
INSERT INTO tender_categories (id, name, description)
VALUES
  ('a1111111-1111-1111-1111-111111111111', 'Construction', 'Building and infrastructure projects'),
  ('a2222222-2222-2222-2222-222222222222', 'IT Services', 'Technology and software services'),
  ('a3333333-3333-3333-3333-333333333333', 'Consulting', 'Professional consulting services'),
  ('a4444444-4444-4444-4444-444444444444', 'Supplies', 'Office and general supplies');

-- Insert Clients
INSERT INTO clients (id, name, type, contact_person, contact_email, contact_phone, created_by_id)
VALUES
  ('b1111111-1111-1111-1111-111111111111', 'Ministry of Education', 'government', 'Michael Brown', 'contact@moe.gov', '+1234567890', '11111111-1111-1111-1111-111111111111'),
  ('b2222222-2222-2222-2222-222222222222', 'Tech Solutions Corp', 'private', 'Lisa Johnson', 'lisa@techsolutions.com', '+1234567891', '11111111-1111-1111-1111-111111111111'),
  ('b3333333-3333-3333-3333-333333333333', 'World Health Organization', 'international', 'David Miller', 'david@who.int', '+1234567892', '11111111-1111-1111-1111-111111111111');

-- Insert Tenders
INSERT INTO tenders (
  id, reference_number, title, description, client_id, category_id, 
  status, publication_date, submission_deadline, estimated_value,
  created_by_id, updated_by_id
)
VALUES
  (    'c1111111-1111-1111-1111-111111111111',
    'TEN-2025-001',
    'School Building Construction',
    'Construction of new school building with 20 classrooms',
    'b1111111-1111-1111-1111-111111111111',
    'a1111111-1111-1111-1111-111111111111',
    'published',
    '2025-06-10',
    '2025-08-15 23:59:59+00',
    1000000.00,
    '22222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222'
  ),  (    'c2222222-2222-2222-2222-222222222222',
    'TEN-2025-002',
    'IT Systems Upgrade',
    'Comprehensive upgrade of IT infrastructure',
    'b2222222-2222-2222-2222-222222222222',
    'a2222222-2222-2222-2222-222222222222',
    'draft',
    '2025-06-15',
    '2025-09-01 23:59:59+00',
    500000.00,
    '33333333-3333-3333-3333-333333333333',
    '33333333-3333-3333-3333-333333333333'
  ),
  (    'c3333333-3333-3333-3333-333333333333',
    'TEN-2025-003',
    'Medical Equipment Supply',
    'Supply of advanced medical diagnostic equipment',
    'b3333333-3333-3333-3333-333333333333',
    'a4444444-4444-4444-4444-444444444444',
    'published',
    '2025-06-12',
    '2025-08-30 23:59:59+00',
    750000.00,
    '22222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222'
  ),
  (    'c4444444-4444-4444-4444-444444444444',
    'TEN-2025-004',
    'Healthcare Consulting Services',
    'Strategic consulting for healthcare operations optimization',
    'b3333333-3333-3333-3333-333333333333',
    'a3333333-3333-3333-3333-333333333333',
    'evaluation',
    '2025-06-01',
    '2025-07-30 23:59:59+00',
    300000.00,
    '33333333-3333-3333-3333-333333333333',
    '33333333-3333-3333-3333-333333333333'
  ),
  (    'c5555555-5555-5555-5555-555555555555',
    'TEN-2025-005',
    'Educational Software Development',
    'Development of interactive learning management system',
    'b1111111-1111-1111-1111-111111111111',
    'a2222222-2222-2222-2222-222222222222',
    'published',
    '2025-06-20',
    '2025-09-15 23:59:59+00',
    450000.00,
    '22222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222'
  ),
  (    'c6666666-6666-6666-6666-666666666666',
    'TEN-2025-006',
    'Office Renovation Project',
    'Complete renovation of ministry headquarters',
    'b1111111-1111-1111-1111-111111111111',
    'a1111111-1111-1111-1111-111111111111',
    'draft',
    '2025-07-01',
    '2025-09-30 23:59:59+00',
    800000.00,
    '33333333-3333-3333-3333-333333333333',
    '33333333-3333-3333-3333-333333333333'
  ),
  (    'c7777777-7777-7777-7777-777777777777',
    'TEN-2025-007',
    'Cybersecurity Assessment',
    'Comprehensive security audit and implementation',
    'b2222222-2222-2222-2222-222222222222',
    'a2222222-2222-2222-2222-222222222222',
    'in_progress',
    '2025-06-05',
    '2025-07-20 23:59:59+00',
    250000.00,
    '22222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222'
  ),
  (    'c8888888-8888-8888-8888-888888888888',
    'TEN-2025-008',
    'Public Health Research',
    'Global health trends research project',
    'b3333333-3333-3333-3333-333333333333',
    'a3333333-3333-3333-3333-333333333333',
    'published',
    '2025-06-25',
    '2025-09-10 23:59:59+00',
    600000.00,
    '33333333-3333-3333-3333-333333333333',
    '33333333-3333-3333-3333-333333333333'
  ),
  (    'c9999999-9999-9999-9999-999999999999',
    'TEN-2025-009',
    'School Laboratory Equipment',
    'Supply and installation of science lab equipment',
    'b1111111-1111-1111-1111-111111111111',
    'a4444444-4444-4444-4444-444444444444',
    'published',
    '2025-06-18',
    '2025-08-25 23:59:59+00',
    400000.00,
    '22222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222'
  ),
  (    'caaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'TEN-2025-010',
    'Digital Transformation Consulting',
    'Enterprise-wide digital transformation strategy',
    'b2222222-2222-2222-2222-222222222222',
    'a3333333-3333-3333-3333-333333333333',
    'draft',
    '2025-07-05',
    '2025-09-20 23:59:59+00',
    350000.00,
    '33333333-3333-3333-3333-333333333333',
    '33333333-3333-3333-3333-333333333333'
  ),  (    'cbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'TEN-2025-011',
    'Healthcare Facility Construction',
    'Construction of new medical center with specialized units',
    'b3333333-3333-3333-3333-333333333333',
    'a1111111-1111-1111-1111-111111111111',
    'published',
    '2025-06-30',
    '2025-09-25 23:59:59+00',
    2000000.00,
    '22222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222'
  ),
  (    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'TEN-2025-012',
    'Office Supplies Contract',
    'Annual office supplies procurement contract',
    'b2222222-2222-2222-2222-222222222222',
    'a4444444-4444-4444-4444-444444444444',
    'draft',
    '2025-07-10',
    '2025-08-20 23:59:59+00',
    150000.00,
    '33333333-3333-3333-3333-333333333333',
    '33333333-3333-3333-3333-333333333333'
  );

-- Insert Documents
INSERT INTO documents (
  id, tender_id, category, title, file_name, file_size, mime_type, 
  storage_url, version, uploaded_by_id
)
VALUES
  (
    'd1111111-1111-1111-1111-111111111111',
    'c1111111-1111-1111-1111-111111111111',
    'tender_notice',
    'Tender Notice - School Building',
    'tender-notice.pdf',
    1024000,
    'application/pdf',
    'https://storage.example.com/documents/tender-notice.pdf',
    1,
    '22222222-2222-2222-2222-222222222222'
  ),
  (
    'd2222222-2222-2222-2222-222222222222',
    'c1111111-1111-1111-1111-111111111111',
    'technical_specifications',
    'Technical Requirements',
    'tech-specs.pdf',
    2048000,
    'application/pdf',
    'https://storage.example.com/documents/tech-specs.pdf',
    1,
    '22222222-2222-2222-2222-222222222222'
  );

-- Insert Tasks
INSERT INTO tasks (
  id, tender_id, title, description, assigned_to_id,
  due_date, priority, created_by_id
)
VALUES
  (
    'e1111111-1111-1111-1111-111111111111',
    'c1111111-1111-1111-1111-111111111111',
    'Review Technical Specifications',
    'Complete review of technical specifications document',
    '33333333-3333-3333-3333-333333333333',
    '2025-06-20 17:00:00+00',
    1,
    '22222222-2222-2222-2222-222222222222'
  ),
  (
    'e2222222-2222-2222-2222-222222222222',
    'c1111111-1111-1111-1111-111111111111',
    'Prepare Financial Analysis',
    'Complete financial analysis for the tender',
    '22222222-2222-2222-2222-222222222222',
    '2025-06-25 17:00:00+00',
    2,
    '22222222-2222-2222-2222-222222222222'
  );

-- Insert Reminder Rules
INSERT INTO reminder_rules (id, name, days_before, message_template)
VALUES
  (
    'f1111111-1111-1111-1111-111111111111',
    'Submission Deadline Warning',
    7,
    'Tender {tender_reference} submission deadline is in 7 days'
  ),
  (
    'f2222222-2222-2222-2222-222222222222',
    'Task Due Soon',
    3,
    'Task {task_title} is due in 3 days'
  );

-- Insert Custom Fields
INSERT INTO custom_fields (
  id, name, field_type, is_required, created_by_id
)
VALUES
  (
    gen_random_uuid(),
    'Contract Duration (months)',
    'number',
    true,
    '11111111-1111-1111-1111-111111111111'
  ),
  (
    gen_random_uuid(),
    'Required ISO Certifications',
    'text',
    false,
    '11111111-1111-1111-1111-111111111111'
  );

-- Insert Custom Field Values
WITH cf1 AS (
  SELECT id FROM custom_fields WHERE name = 'Contract Duration (months)' LIMIT 1
),
cf2 AS (
  SELECT id FROM custom_fields WHERE name = 'Required ISO Certifications' LIMIT 1
)
INSERT INTO custom_field_values (
  id, tender_id, custom_field_id, value
)
VALUES
  (
    gen_random_uuid(),
    'c1111111-1111-1111-1111-111111111111',
    (SELECT id FROM cf1),
    '24'
  ),
  (
    gen_random_uuid(),
    'c1111111-1111-1111-1111-111111111111',
    (SELECT id FROM cf2),
    'ISO 9001, ISO 14001'
  );

-- Insert Team Members
INSERT INTO tender_team_members (
  id, tender_id, user_id, role
)
VALUES
  (
    gen_random_uuid(),
    'c1111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    'Lead'
  ),
  (
    gen_random_uuid(),
    'c1111111-1111-1111-1111-111111111111',
    '33333333-3333-3333-3333-333333333333',
    'Technical Reviewer'
  ),
  (
    gen_random_uuid(),
    'c1111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444444',
    'Legal Reviewer'
  );

-- Insert some initial activity logs
INSERT INTO activity_logs (
  id, tender_id, user_id, action, details
)
VALUES
  (
    gen_random_uuid(),
    'c1111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    'TENDER_CREATED',
    'Created new tender for School Building Construction'
  ),
  (
    gen_random_uuid(),
    'c1111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    'DOCUMENT_UPLOADED',
    'Uploaded tender notice document'
  );

-- Insert allowed status transitions
INSERT INTO allowed_status_transitions (
  id, from_status, to_status, required_role
)
VALUES
  (gen_random_uuid(), 'draft', 'published', 'admin'),
  (gen_random_uuid(), 'published', 'in_progress', 'tender_officer'),
  (gen_random_uuid(), 'in_progress', 'submitted', 'tender_officer'),
  (gen_random_uuid(), 'submitted', 'evaluation', 'admin'),
  (gen_random_uuid(), 'evaluation', 'awarded', 'admin'),
  (gen_random_uuid(), 'evaluation', 'rejected', 'admin');
