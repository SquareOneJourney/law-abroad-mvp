-- Enhanced seed data with proactive content approach
-- Insert more specific subcategories based on feedback

-- Insert additional subcategories for better traveler focus
INSERT INTO law_subcategories (category_id, name, description) VALUES 
-- Added more specific Alcohol subcategories
((SELECT id FROM law_categories WHERE name = 'Alcohol'), 'Legal Drinking Age', 'Minimum age requirements for alcohol consumption'),
((SELECT id FROM law_categories WHERE name = 'Alcohol'), 'Public Consumption', 'Rules for drinking in public spaces'),
((SELECT id FROM law_categories WHERE name = 'Alcohol'), 'Licensing Hours', 'When alcohol can be sold and consumed'),

-- Added Cultural & Social Respect subcategories
((SELECT id FROM law_categories WHERE name = 'Cultural & Social Respect'), 'Dress Codes', 'Religious and cultural clothing requirements'),
((SELECT id FROM law_categories WHERE name = 'Cultural & Social Respect'), 'Behavior Norms', 'Expected conduct and gestures'),
((SELECT id FROM law_categories WHERE name = 'Cultural & Social Respect'), 'LGBTQ+ Rights', 'Legal protections and social acceptance'),

-- Added Customs & Imports subcategories
((SELECT id FROM law_categories WHERE name = 'Customs & Imports'), 'Medication Limits', 'Prescription and OTC drug import rules'),
((SELECT id FROM law_categories WHERE name = 'Customs & Imports'), 'Currency Limits', 'Cash declaration requirements'),
((SELECT id FROM law_categories WHERE name = 'Customs & Imports'), 'Prohibited Goods', 'Items banned from import/export')
ON CONFLICT DO NOTHING;

-- Insert proactive FAQs for Thailand
INSERT INTO country_faqs (country_id, category_id, question, answer, priority) VALUES 
(
    (SELECT id FROM countries WHERE code = 'TH'),
    (SELECT id FROM law_categories WHERE name = 'Drugs'),
    'Can I bring my ADHD medication to Thailand?',
    'Many ADHD medications like Adderall are banned. You need a medical certificate and import permit. Contact Thai embassy before travel.',
    10
),
(
    (SELECT id FROM countries WHERE code = 'TH'),
    (SELECT id FROM law_categories WHERE name = 'Drugs'),
    'Is cannabis legal in Thailand?',
    'Cannabis was decriminalized in 2022 but smoking in public is still illegal. Edibles and oils are allowed but check current regulations.',
    9
),
(
    (SELECT id FROM countries WHERE code = 'TH'),
    (SELECT id FROM law_categories WHERE name = 'Cultural & Social Respect'),
    'What should I not do regarding the Thai royal family?',
    'Never criticize, joke about, or show disrespect to the monarchy. This includes social media posts. Penalties are 3-15 years in prison.',
    10
),
(
    (SELECT id FROM countries WHERE code = 'TH'),
    (SELECT id FROM law_categories WHERE name = 'Photography & Filming'),
    'Can I fly a drone in Thailand?',
    'You need permits from NBTC for recreational drones. Commercial use requires additional licenses. Banned near airports and government buildings.',
    7
);

-- Insert proactive FAQs for Japan
INSERT INTO country_faqs (country_id, category_id, question, answer, priority) VALUES 
(
    (SELECT id FROM countries WHERE code = 'JP'),
    (SELECT id FROM law_categories WHERE name = 'Drugs'),
    'Which common medications are banned in Japan?',
    'Adderall, Vyvanse, codeine-based painkillers, and many allergy medications. Get a yakkan shoumei (import certificate) before travel.',
    10
),
(
    (SELECT id FROM countries WHERE code = 'JP'),
    (SELECT id FROM law_categories WHERE name = 'Cultural & Social Respect'),
    'Will my tattoos cause problems in Japan?',
    'Tattoos may restrict access to onsen, public baths, gyms, and some hotels. Not illegal but culturally sensitive.',
    8
),
(
    (SELECT id FROM countries WHERE code = 'JP'),
    (SELECT id FROM law_categories WHERE name = 'Photography & Filming'),
    'Can I take photos of people in Japan?',
    'Taking photos of people without consent can be illegal, especially on trains. Always ask permission first.',
    7
);

-- Insert proactive FAQs for UK
INSERT INTO country_faqs (country_id, category_id, question, answer, priority) VALUES 
(
    (SELECT id FROM countries WHERE code = 'GB'),
    (SELECT id FROM law_categories WHERE name = 'Transport & Driving'),
    'Do I need an international driving permit in the UK?',
    'Yes, visitors need either an International Driving Permit or valid EU/EEA license. US licenses alone are not sufficient.',
    9
),
(
    (SELECT id FROM countries WHERE code = 'GB'),
    (SELECT id FROM law_categories WHERE name = 'Alcohol'),
    'What time do pubs close in the UK?',
    'Most pubs close at 11pm Sunday-Thursday, midnight Friday-Saturday. Some have extended licenses for 24-hour service.',
    6
);

-- Update existing laws with red flag alerts and cultural context
UPDATE country_laws SET 
    red_flag_alert = 'DEATH PENALTY POSSIBLE - Zero tolerance policy',
    cultural_context = 'Thailand has one of the world''s strictest drug policies due to historical opium problems'
WHERE country_id = (SELECT id FROM countries WHERE code = 'TH') 
    AND category_id = (SELECT id FROM law_categories WHERE name = 'Drugs')
    AND subcategory_id = (SELECT id FROM law_subcategories WHERE name = 'Recreational Drugs');

UPDATE country_laws SET 
    red_flag_alert = 'IMPRISONMENT UP TO 15 YEARS - Lese majeste law strictly enforced',
    cultural_context = 'Thai monarchy is deeply revered; even tourists from countries with free speech are prosecuted'
WHERE country_id = (SELECT id FROM countries WHERE code = 'TH') 
    AND summary LIKE '%monarchy%';

UPDATE country_laws SET 
    red_flag_alert = 'ARREST AT AIRPORT - Many common US medications are banned',
    cultural_context = 'Japan''s strict drug laws stem from post-WWII policies; even trace amounts can cause detention'
WHERE country_id = (SELECT id FROM countries WHERE code = 'JP') 
    AND category_id = (SELECT id FROM law_categories WHERE name = 'Drugs');
