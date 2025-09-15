-- Add comprehensive sample data for Law Abroad app

-- Insert countries
INSERT INTO countries (code, name) VALUES 
('US', 'United States'),
('JP', 'Japan'),
('DE', 'Germany'),
('FR', 'France'),
('GB', 'United Kingdom'),
('AU', 'Australia'),
('CA', 'Canada'),
('IT', 'Italy'),
('ES', 'Spain'),
('NL', 'Netherlands')
ON CONFLICT (code) DO NOTHING;

-- Insert law categories
INSERT INTO law_categories (name, description) VALUES 
('Drug Laws', 'Laws related to possession, use, and trafficking of controlled substances'),
('Traffic Laws', 'Driving regulations, speed limits, and vehicle requirements'),
('Public Behavior', 'Laws governing conduct in public spaces and social interactions'),
('Immigration', 'Entry requirements, visa regulations, and border control'),
('Business Laws', 'Commercial regulations, licensing, and trade restrictions'),
('Cultural Laws', 'Religious practices, cultural customs, and social norms'),
('Environmental', 'Environmental protection and conservation regulations'),
('Technology', 'Digital privacy, cybersecurity, and technology usage laws')
ON CONFLICT (name) DO NOTHING;

-- Insert sample laws for Japan
INSERT INTO country_laws (country_id, category_id, summary, severity, details, raw_text) 
SELECT 
    c.id,
    lc.id,
    'Possession of any amount of cannabis is strictly prohibited and can result in up to 5 years imprisonment.',
    'critical',
    'Japan has zero tolerance for drug possession. Even small amounts of cannabis can lead to immediate arrest, detention for up to 23 days without bail, and potential imprisonment. Foreign nationals may face deportation.',
    'Article 24-2 of the Cannabis Control Law: Any person who possesses cannabis shall be punished by imprisonment with work for not more than five years.'
FROM countries c, law_categories lc 
WHERE c.code = 'JP' AND lc.name = 'Drug Laws';

INSERT INTO country_laws (country_id, category_id, summary, severity, details, raw_text)
SELECT 
    c.id,
    lc.id,
    'Tattoos may restrict access to public baths, gyms, and some accommodations.',
    'medium',
    'While not illegal, visible tattoos are associated with organized crime and may result in denial of service at onsen (hot springs), public baths, gyms, and some hotels. Consider covering tattoos in public.',
    'Cultural regulation: Many establishments reserve the right to refuse service to individuals with visible tattoos due to historical associations with yakuza.'
FROM countries c, law_categories lc 
WHERE c.code = 'JP' AND lc.name = 'Cultural Laws';

-- Insert sample laws for Germany
INSERT INTO country_laws (country_id, category_id, summary, severity, details, raw_text)
SELECT 
    c.id,
    lc.id,
    'Quiet hours (Ruhezeit) must be observed from 10 PM to 6 AM on weekdays.',
    'medium',
    'Making noise during designated quiet hours can result in fines up to €5,000. This includes loud music, construction work, and even vacuuming. Sunday is considered a full day of rest.',
    'Hausordnung and local noise ordinances: Disturbing the peace during Ruhezeit is subject to administrative fines and potential civil liability.'
FROM countries c, law_categories lc 
WHERE c.code = 'DE' AND lc.name = 'Public Behavior';

INSERT INTO country_laws (country_id, category_id, summary, severity, details, raw_text)
SELECT 
    c.id,
    lc.id,
    'Nazi symbols, gestures, and Holocaust denial are criminal offenses.',
    'critical',
    'Displaying Nazi symbols, performing Nazi salutes, or denying the Holocaust can result in up to 5 years imprisonment. This applies to tourists and includes social media posts.',
    'Section 86a of the Criminal Code: Use of symbols of unconstitutional organizations is punishable by up to three years imprisonment or fine.'
FROM countries c, law_categories lc 
WHERE c.code = 'DE' AND lc.name = 'Cultural Laws';

-- Insert sample laws for United States
INSERT INTO country_laws (country_id, category_id, summary, severity, details, raw_text)
SELECT 
    c.id,
    lc.id,
    'Cannabis laws vary significantly by state - legal in some states, felony in others.',
    'high',
    'Cannabis is federally illegal but state laws vary widely. What is legal in California may be a felony in Texas. Always check local state laws before traveling.',
    'Controlled Substances Act: Cannabis remains federally classified as a Schedule I substance, but state laws provide varying degrees of legalization.'
FROM countries c, law_categories lc 
WHERE c.code = 'US' AND lc.name = 'Drug Laws';

INSERT INTO country_laws (country_id, category_id, summary, severity, details, raw_text)
SELECT 
    c.id,
    lc.id,
    'Drinking alcohol in public spaces is prohibited in most cities.',
    'medium',
    'Open container laws prohibit drinking alcohol in public areas like streets, parks, and beaches in most jurisdictions. Fines typically range from $50-$500.',
    'Open Container Laws: Most states and municipalities prohibit the consumption of alcoholic beverages in public places.'
FROM countries c, law_categories lc 
WHERE c.code = 'US' AND lc.name = 'Public Behavior';

-- Insert emergency contacts for sample countries
INSERT INTO emergency_contacts (country_id, service_type, phone_number, description) 
SELECT c.id, 'Police', '110', 'Emergency police services'
FROM countries c WHERE c.code = 'JP';

INSERT INTO emergency_contacts (country_id, service_type, phone_number, description)
SELECT c.id, 'Medical', '119', 'Fire department and ambulance services'
FROM countries c WHERE c.code = 'JP';

INSERT INTO emergency_contacts (country_id, service_type, phone_number, description)
SELECT c.id, 'Police', '110', 'Emergency police services'
FROM countries c WHERE c.code = 'DE';

INSERT INTO emergency_contacts (country_id, service_type, phone_number, description)
SELECT c.id, 'Medical', '112', 'Emergency medical services and fire department'
FROM countries c WHERE c.code = 'DE';

INSERT INTO emergency_contacts (country_id, service_type, phone_number, description)
SELECT c.id, 'Police', '911', 'Emergency police, fire, and medical services'
FROM countries c WHERE c.code = 'US';

-- Insert sample FAQs
INSERT INTO country_faqs (country_id, question, answer, category)
SELECT c.id, 'Can I use my credit card everywhere?', 'Japan is still largely a cash-based society. Many small restaurants, shops, and even some hotels only accept cash. Always carry sufficient yen.', 'Payment'
FROM countries c WHERE c.code = 'JP';

INSERT INTO country_faqs (country_id, question, answer, category)
SELECT c.id, 'Do I need to tip?', 'Tipping is not customary in Japan and can sometimes be considered rude. Exceptional service is expected as standard.', 'Culture'
FROM countries c WHERE c.code = 'JP';

INSERT INTO country_faqs (country_id, question, answer, category)
SELECT c.id, 'What should I know about German bureaucracy?', 'Germans value punctuality and proper documentation. Always bring required documents to appointments and arrive on time.', 'Culture'
FROM countries c WHERE c.code = 'DE';

INSERT INTO country_faqs (country_id, question, answer, category)
SELECT c.id, 'Can I drink tap water?', 'German tap water is safe to drink and of high quality. Restaurants may charge for tap water, so specify if you want free tap water ("Leitungswasser").', 'Health'
FROM countries c WHERE c.code = 'DE';
