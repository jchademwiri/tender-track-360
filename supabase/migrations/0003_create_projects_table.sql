CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id UUID REFERENCES tenders(id),
  reference_number VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  client_id UUID REFERENCES clients(id) NOT NULL,
  category_id UUID REFERENCES tender_categories(id),
  status VARCHAR(50) NOT NULL,
  award_date VARCHAR,
  estimated_value NUMERIC(15,2),
  department VARCHAR(100),
  notes TEXT,
  created_by_id UUID REFERENCES users(id) NOT NULL,
  updated_by_id UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
); 