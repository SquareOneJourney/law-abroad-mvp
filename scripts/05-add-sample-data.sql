-- Adding sample countries and data for testing
INSERT INTO countries (name, code) VALUES 
  ('United States', 'US'),
  ('United Kingdom', 'GB'),
  ('Japan', 'JP'),
  ('Germany', 'DE'),
  ('France', 'FR')
ON CONFLICT (code) DO NOTHING;

-- Adding sample law categories
INSERT INTO law_categories (name, description) VALUES 
  ('Drug Laws', 'Laws related to controlled substances and narcotics'),
  ('Traffic Laws', 'Road traffic regulations and driving requirements'),
  ('Public Behavior', 'Laws governing conduct in public spaces'),
  ('Photography', 'Restrictions on photography and filming'),
  ('Customs', 'Import/export regulations and customs requirements')
ON CONFLICT (name) DO NOTHING;

-- Adding sample laws for US
INSERT INTO country_laws (country_id, category_id, summary, details, severity) 
SELECT 
  c.id,
  lc.id,
  'Marijuana laws vary by state',
  'While some states have legalized marijuana for recreational use, it remains federally illegal. Always check local state laws before traveling.',
  'medium'
FROM countries c, law_categories lc 
WHERE c.code = 'US' AND lc.name = 'Drug Laws'
ON CONFLICT DO NOTHING;

-- Adding sample FAQs for US
INSERT INTO country_faqs (country_id, question, answer, category, priority)
SELECT 
  c.id,
  'Can I bring prescription medication into the US?',
  'Yes, but keep medications in original containers with prescription labels. Bring a letter from your doctor for controlled substances.',
  'Customs',
  1
FROM countries c 
WHERE c.code = 'US'
ON CONFLICT DO NOTHING;

INSERT INTO country_faqs (country_id, question, answer, category, priority)
SELECT 
  c.id,
  'What should I know about tipping in the US?',
  'Tipping is customary and expected in restaurants (15-20%), for taxi drivers, hotel staff, and many service providers.',
  'Cultural',
  2
FROM countries c 
WHERE c.code = 'US'
ON CONFLICT DO NOTHING;
