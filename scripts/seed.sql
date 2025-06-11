-- Seed data for Tender Track 360
-- Reset sequences and clean existing data (if any)
TRUNCATE TABLE users, user_preferences, tender_categories, clients, tenders, documents, tasks, reminder_rules, notifications, activity_logs, allowed_status_transitions, tender_extensions, extension_history, extension_reminders CASCADE;

-- Insert Users
INSERT INTO users (id, email, full_name, role, department, is_active, profile_image_url)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin@tendertrack.com', 'System Administrator', 'admin', 'Administration', true, NULL),
  ('22222222-2222-2222-2222-222222222222', 'manager1@tendertrack.com', 'Jane Smith', 'tender_manager', 'Procurement', true, NULL),
  ('33333333-3333-3333-3333-333333333333', 'specialist1@tendertrack.com', 'John Doe', 'tender_specialist', 'Finance', true, NULL),
  ('44444444-4444-4444-4444-444444444444', 'viewer1@tendertrack.com', 'Sarah Wilson', 'viewer', 'Legal', true, NULL);

-- Insert User Preferences
INSERT INTO user_preferences (id, user_id, email_notifications, reminder_days, timezone)
VALUES
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', true, 7, 'UTC'),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', true, 5, 'UTC'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', true, 3, 'UTC'),
  (gen_random_uuid(), '44444444-4444-4444-4444-444444444444', true, 7, 'UTC');

-- Insert Tender Categories
INSERT INTO tender_categories (id, name, description, is_active)
VALUES
  ('a1111111-1111-1111-1111-111111111111', 'Construction', 'Building and infrastructure projects', true),
  ('a2222222-2222-2222-2222-222222222222', 'IT Services', 'Technology and software services', true),
  ('a3333333-3333-3333-3333-333333333333', 'Consulting', 'Professional consulting services', true),
  ('a4444444-4444-4444-4444-444444444444', 'Supplies', 'Office and general supplies', true);

-- Insert Clients
INSERT INTO clients (id, name, type, contact_person, contact_email, contact_phone, created_by_id, is_active)
VALUES
  ('b1111111-1111-1111-1111-111111111111', 'Ministry of Education', 'government', 'Michael Brown', 'contact@moe.gov', '+1234567890', '11111111-1111-1111-1111-111111111111', true),
  ('b2222222-2222-2222-2222-222222222222', 'Tech Solutions Corp', 'private', 'Lisa Johnson', 'lisa@techsolutions.com', '+1234567891', '11111111-1111-1111-1111-111111111111', true),
  ('b3333333-3333-3333-3333-333333333333', 'World Health Organization', 'international', 'David Miller', 'david@who.int', '+1234567892', '11111111-1111-1111-1111-111111111111', true);

-- Insert Tenders (Note: status 'draft' is not in the enum, using 'in_progress' instead)
INSERT INTO tenders (
  id, reference_number, title, description, client_id, category_id, 
  status, publication_date, submission_deadline, estimated_value,
  created_by_id, updated_by_id
)
VALUES
  (
    'c1111111-1111-1111-1111-111111111111',
    'TEN-2025-001',
    'School Building Construction',
    'Construction of new school building with 20 classrooms',
    'b1111111-1111-1111-1111-111111111111',
    'a1111111-1111-1111-1111-111111111111',
    'in_progress',
    '2025-06-10',
    '2025-08-15 23:59:59+00',
    1000000.00,
    '22222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222'
  ),
  (
    'c2222222-2222-2222-2222-222222222222',
    'TEN-2025-002',
    'IT Systems Upgrade',
    'Comprehensive upgrade of IT infrastructure',
    'b2222222-2222-2222-2222-222222222222',
    'a2222222-2222-2222-2222-222222222222',
    'in_progress',
    '2025-06-15',
    '2025-09-01 23:59:59+00',
    500000.00,
    '33333333-3333-3333-3333-333333333333',
    '33333333-3333-3333-3333-333333333333'
  ),
  (
    'c3333333-3333-3333-3333-333333333333',
    'TEN-2025-003',
    'Medical Equipment Supply',
    'Supply of advanced medical diagnostic equipment',
    'b3333333-3333-3333-3333-333333333333',
    'a4444444-4444-4444-4444-444444444444',
    'submitted',
    '2025-06-12',
    '2025-08-30 23:59:59+00',
    750000.00,
    '22222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222'
  ),
  (
    'c4444444-4444-4444-4444-444444444444',
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
  (
    'c5555555-5555-5555-5555-555555555555',
    'TEN-2025-005',
    'Educational Software Development',
    'Development of interactive learning management system',
    'b1111111-1111-1111-1111-111111111111',
    'a2222222-2222-2222-2222-222222222222',
    'submitted',
    '2025-06-20',
    '2025-09-15 23:59:59+00',
    450000.00,
    '22222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222'
  ),
  (
    'c6666666-6666-6666-6666-666666666666',
    'TEN-2025-006',
    'Office Renovation Project',
    'Complete renovation of ministry headquarters',
    'b1111111-1111-1111-1111-111111111111',
    'a1111111-1111-1111-1111-111111111111',
    'in_progress',
    '2025-07-01',
    '2025-09-30 23:59:59+00',
    800000.00,
    '33333333-3333-3333-3333-333333333333',
    '33333333-3333-3333-3333-333333333333'
  ),
  (
    'c7777777-7777-7777-7777-777777777777',
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
  (
    'c8888888-8888-8888-8888-888888888888',
    'TEN-2025-008',
    'Public Health Research',
    'Global health trends research project',
    'b3333333-3333-3333-3333-333333333333',
    'a3333333-3333-3333-3333-333333333333',
    'submitted',
    '2025-06-25',
    '2025-09-10 23:59:59+00',
    600000.00,
    '33333333-3333-3333-3333-333333333333',
    '33333333-3333-3333-3333-333333333333'
  ),
  (
    'c9999999-9999-9999-9999-999999999999',
    'TEN-2025-009',
    'School Laboratory Equipment',
    'Supply and installation of science lab equipment',
    'b1111111-1111-1111-1111-111111111111',
    'a4444444-4444-4444-4444-444444444444',
    'awarded',
    '2025-06-18',
    '2025-08-25 23:59:59+00',
    400000.00,
    '22222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222'
  ),
  (
    'caaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'TEN-2025-010',
    'Digital Transformation Consulting',
    'Enterprise-wide digital transformation strategy',
    'b2222222-2222-2222-2222-222222222222',
    'a3333333-3333-3333-3333-333333333333',
    'cancelled',
    '2025-07-05',
    '2025-09-20 23:59:59+00',
    350000.00,
    '33333333-3333-3333-3333-333333333333',
    '33333333-3333-3333-3333-333333333333'
  ),
  (
    'cbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'TEN-2025-011',
    'Healthcare Facility Construction',
    'Construction of new medical center with specialized units',
    'b3333333-3333-3333-3333-333333333333',
    'a1111111-1111-1111-1111-111111111111',
    'evaluation',
    '2025-06-30',
    '2025-09-25 23:59:59+00',
    2000000.00,
    '22222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222'
  ),
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'TEN-2025-012',
    'Office Supplies Contract',
    'Annual office supplies procurement contract',
    'b2222222-2222-2222-2222-222222222222',
    'a4444444-4444-4444-4444-444444444444',
    'rejected',
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
  ),
  (
    'd3333333-3333-3333-3333-333333333333',
    'c3333333-3333-3333-3333-333333333333',
    'financial_proposal',
    'Financial Proposal Template',
    'financial-proposal.pdf',
    1536000,
    'application/pdf',
    'https://storage.example.com/documents/financial-proposal.pdf',
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
  ),
  (
    'e3333333-3333-3333-3333-333333333333',
    'c4444444-4444-4444-4444-444444444444',
    'Evaluation Committee Setup',
    'Set up evaluation committee for healthcare consulting tender',
    '33333333-3333-3333-3333-333333333333',
    '2025-06-28 17:00:00+00',
    1,
    '33333333-3333-3333-3333-333333333333'
  );

-- Insert Reminder Rules
INSERT INTO reminder_rules (id, name, days_before, message_template, is_active)
VALUES
  (
    'f1111111-1111-1111-1111-111111111111',
    'Submission Deadline Warning',
    7,
    'Tender {tender_reference} submission deadline is in 7 days',
    true
  ),
  (
    'f2222222-2222-2222-2222-222222222222',
    'Task Due Soon',
    3,
    'Task {task_title} is due in 3 days',
    true
  ),
  (
    'f3333333-3333-3333-3333-333333333333',
    'Evaluation Deadline',
    5,
    'Tender {tender_reference} evaluation deadline is in 5 days',
    true
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
  ),
  (
    gen_random_uuid(),
    'c4444444-4444-4444-4444-444444444444',
    '33333333-3333-3333-3333-333333333333',
    'STATUS_CHANGED',
    'Changed tender status to evaluation'
  ),
  (
    gen_random_uuid(),
    'c9999999-9999-9999-9999-999999999999',
    '22222222-2222-2222-2222-222222222222',
    'TENDER_AWARDED',
    'Tender awarded for School Laboratory Equipment'
  );

-- Insert allowed status transitions
INSERT INTO allowed_status_transitions (
  id, from_status, to_status, required_role
)
VALUES
  (gen_random_uuid(), 'in_progress', 'submitted', 'tender_manager'),
  (gen_random_uuid(), 'submitted', 'evaluation', 'admin'),
  (gen_random_uuid(), 'evaluation', 'awarded', 'admin'),
  (gen_random_uuid(), 'evaluation', 'rejected', 'admin'),
  (gen_random_uuid(), 'in_progress', 'cancelled', 'admin'),
  (gen_random_uuid(), 'submitted', 'cancelled', 'admin'),
  (gen_random_uuid(), 'evaluation', 'cancelled', 'admin');

-- Insert some notifications
INSERT INTO notifications (
  id, user_id, type, title, message, related_entity_id, is_read
)
VALUES
  (
    gen_random_uuid(),
    '22222222-2222-2222-2222-222222222222',
    'deadline',
    'Tender Deadline Approaching',
    'Tender TEN-2025-001 submission deadline is in 3 days',
    'c1111111-1111-1111-1111-111111111111',
    false
  ),
  (
    gen_random_uuid(),
    '33333333-3333-3333-3333-333333333333',
    'task_assignment',
    'New Task Assigned',
    'You have been assigned to review technical specifications',
    'e1111111-1111-1111-1111-111111111111',
    false
  ),
  (
    gen_random_uuid(),
    '44444444-4444-4444-4444-444444444444',
    'status_change',
    'Tender Status Updated',
    'Tender TEN-2025-004 status changed to evaluation',
    'c4444444-4444-4444-4444-444444444444',
    true
  );

-- Insert sample tender extensions
INSERT INTO tender_extensions (
  id, tender_id, extension_number, extension_type, status,
  original_deadline, current_deadline, requested_new_deadline,
  extension_days, cumulative_days, reason, client_reference,
  received_at, received_by_id
)
VALUES
  (
    'x1111111-1111-1111-1111-111111111111',
    'c1111111-1111-1111-1111-111111111111',
    'EXT-001',
    'evaluation',
    'received',
    '2025-08-15 23:59:59+00',
    '2025-08-15 23:59:59+00',
    '2025-08-30 23:59:59+00',
    15,
    15,
    'Additional time needed for technical evaluation due to complexity',
    'MOE-EXT-2025-001',
    '2025-08-10 10:00:00+00',
    '22222222-2222-2222-2222-222222222222'
  ),
  (
    'x2222222-2222-2222-2222-222222222222',
    'c3333333-3333-3333-3333-333333333333',
    'EXT-001',
    'award',
    'completed',
    '2025-08-30 23:59:59+00',
    '2025-08-30 23:59:59+00',
    '2025-09-15 23:59:59+00',
    16,
    16,
    'Delayed approval process from procurement committee',
    'WHO-EXT-2025-003',
    '2025-08-25 14:30:00+00',
    '33333333-3333-3333-3333-333333333333'
  );

-- Insert extension history
INSERT INTO extension_history (
  id, extension_id, previous_status, new_status, changed_by_id, change_reason
)
VALUES
  (
    gen_random_uuid(),
    'x2222222-2222-2222-2222-222222222222',
    'received',
    'in_progress',
    '33333333-3333-3333-3333-333333333333',
    'Started processing extension request'
  ),
  (
    gen_random_uuid(),
    'x2222222-2222-2222-2222-222222222222',
    'in_progress',
    'completed',
    '33333333-3333-3333-3333-333333333333',
    'Extension processing completed, ready to send to client'
  );

-- Insert extension reminders
INSERT INTO extension_reminders (
  id, extension_id, reminder_type, scheduled_for, is_active
)
VALUES
  (
    gen_random_uuid(),
    'x1111111-1111-1111-1111-111111111111',
    'deadline_approaching',
    '2025-08-13 09:00:00+00',
    true
  ),
  (
    gen_random_uuid(),
    'x2222222-2222-2222-2222-222222222222',
    'follow_up',
    '2025-09-01 09:00:00+00',
    true
  );