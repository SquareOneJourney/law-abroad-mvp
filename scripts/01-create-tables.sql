-- Enhanced database schema with subcategories, scenarios, and source URLs
-- Create tables for Law Abroad MVP

-- Countries table
CREATE TABLE IF NOT EXISTS countries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(3) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Law categories table
CREATE TABLE IF NOT EXISTS law_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Law subcategories table
CREATE TABLE IF NOT EXISTS law_subcategories (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES law_categories(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Country laws table
CREATE TABLE IF NOT EXISTS country_laws (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id),
    category_id INTEGER REFERENCES law_categories(id),
    subcategory_id INTEGER REFERENCES law_subcategories(id),
    summary TEXT NOT NULL,
    severity VARCHAR(20) CHECK (severity IN ('info', 'warning', 'critical')),
    details TEXT,
    scenario TEXT, -- Common traveler scenarios
    source_url VARCHAR(500), -- Official source links
    red_flag_alert TEXT, -- Added red flag alerts for serious penalties
    cultural_context TEXT, -- Added cultural context and exceptions
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Added FAQs table for proactive content
CREATE TABLE IF NOT EXISTS country_faqs (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id),
    category_id INTEGER REFERENCES law_categories(id),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    priority INTEGER DEFAULT 1, -- Higher priority FAQs shown first
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Emergency contacts table
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id),
    contact_type VARCHAR(50) NOT NULL, -- 'embassy', 'police', 'medical', 'tourist_police'
    name VARCHAR(200) NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    email VARCHAR(100),
    website VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_country_laws_country ON country_laws(country_id);
CREATE INDEX IF NOT EXISTS idx_country_laws_category ON country_laws(category_id);
CREATE INDEX IF NOT EXISTS idx_country_laws_subcategory ON country_laws(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_country ON emergency_contacts(country_id);
CREATE INDEX IF NOT EXISTS idx_subcategories_category ON law_subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_country_faqs_country ON country_faqs(country_id); -- Added FAQ index
CREATE INDEX IF NOT EXISTS idx_country_faqs_priority ON country_faqs(priority DESC); -- Added priority index
