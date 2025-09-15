-- Insert sample data for Law Abroad MVP

-- Insert countries
INSERT INTO countries (name, code) VALUES 
('Thailand', 'TH'),
('Japan', 'JP'),
('United Kingdom', 'GB')
ON CONFLICT (code) DO NOTHING;

-- Insert law categories (specific categories from requirements)
INSERT INTO law_categories (name, description) VALUES 
('Drugs', 'Laws regarding controlled substances, prescription drugs, and recreational substances'),
('Alcohol', 'Legal drinking age, public consumption rules, and dry zones'),
('Cultural & Social Respect', 'Dress codes, behavior norms, LGBTQ+ rights, and cultural sensitivities'),
('Photography & Filming', 'Restricted zones, drone usage, and public/private photography distinctions'),
('Customs & Imports', 'Medication carriage, currency limits, and prohibited goods'),
('Transport & Driving', 'Tourist licenses, road rules, and insurance requirements')
ON CONFLICT DO NOTHING;

-- Insert subcategories
INSERT INTO law_subcategories (category_id, name, description) VALUES 
-- Drugs subcategories
((SELECT id FROM law_categories WHERE name = 'Drugs'), 'Prescription Drugs', 'Bringing prescription medications across borders'),
((SELECT id FROM law_categories WHERE name = 'Drugs'), 'Recreational Drugs', 'Illegal substances and penalties'),
((SELECT id FROM law_categories WHERE name = 'Drugs'), 'OTC Medicines', 'Over-the-counter medications that may be restricted'),
-- Photography subcategories
((SELECT id FROM law_categories WHERE name = 'Photography & Filming'), 'Drone Usage', 'Regulations for recreational and commercial drone use'),
((SELECT id FROM law_categories WHERE name = 'Photography & Filming'), 'Restricted Zones', 'Areas where photography is prohibited'),
((SELECT id FROM law_categories WHERE name = 'Photography & Filming'), 'Public Photography', 'Rules for photographing in public spaces'),
-- Transport subcategories
((SELECT id FROM law_categories WHERE name = 'Transport & Driving'), 'Tourist Licenses', 'International driving permits and requirements'),
((SELECT id FROM law_categories WHERE name = 'Transport & Driving'), 'Road Rules', 'Local traffic laws and regulations'),
((SELECT id FROM law_categories WHERE name = 'Transport & Driving'), 'Insurance', 'Required insurance coverage for visitors')
ON CONFLICT DO NOTHING;

-- Insert enhanced country laws for Thailand
INSERT INTO country_laws (country_id, category_id, subcategory_id, summary, severity, details, scenario, source_url) VALUES 
(
    (SELECT id FROM countries WHERE code = 'TH'),
    (SELECT id FROM law_categories WHERE name = 'Drugs'),
    (SELECT id FROM law_subcategories WHERE name = 'Recreational Drugs'),
    'Death penalty possible for drug trafficking, life imprisonment for possession',
    'danger',
    'Thailand has zero tolerance for drugs. Possession of even small amounts can result in 4-15 years imprisonment. Trafficking can result in death penalty or life imprisonment.',
    'Tourist caught with marijuana at airport faces minimum 4 years in prison',
    'https://www.gov.uk/foreign-travel-advice/thailand/local-laws-and-customs'
),
(
    (SELECT id FROM countries WHERE code = 'TH'),
    (SELECT id FROM law_categories WHERE name = 'Drugs'),
    (SELECT id FROM law_subcategories WHERE name = 'Prescription Drugs'),
    'Strict controls on prescription medications - bring prescriptions and declarations',
    'warning',
    'Many common prescription drugs are banned or controlled. Bring original prescriptions, medical certificates, and declare at customs.',
    'Tourist with ADHD medication detained for 3 days without proper documentation',
    'https://www.thaiembassy.com/travel-to-thailand/bringing-medication-to-thailand'
),
(
    (SELECT id FROM countries WHERE code = 'TH'),
    (SELECT id FROM law_categories WHERE name = 'Cultural & Social Respect'),
    null,
    'Lese majeste laws - insulting monarchy punishable by 3-15 years imprisonment',
    'danger',
    'Any criticism or disrespect toward the Thai royal family is illegal. This includes social media posts, even from abroad.',
    'Tourist jailed for 2.5 years for posting negative comment about king on Facebook',
    'https://www.gov.uk/foreign-travel-advice/thailand/local-laws-and-customs'
),
(
    (SELECT id FROM countries WHERE code = 'TH'),
    (SELECT id FROM law_categories WHERE name = 'Photography & Filming'),
    (SELECT id FROM law_subcategories WHERE name = 'Drone Usage'),
    'Drones require permits and are banned in many areas including Bangkok',
    'warning',
    'Recreational drones need permits from NBTC. Commercial use requires additional licenses. Banned near airports, government buildings, and royal palaces.',
    'Tourist fined $1000 and drone confiscated for flying near Grand Palace',
    'https://www.nbtc.go.th/en/information/drone-regulations'
);

-- Insert enhanced country laws for Japan
INSERT INTO country_laws (country_id, category_id, subcategory_id, summary, severity, details, scenario, source_url) VALUES 
(
    (SELECT id FROM countries WHERE code = 'JP'),
    (SELECT id FROM law_categories WHERE name = 'Drugs'),
    (SELECT id FROM law_subcategories WHERE name = 'Prescription Drugs'),
    'Many common medications are banned - check before travel',
    'danger',
    'Adderall, Vyvanse, and many ADHD medications are banned. Codeine-based painkillers are restricted. Bring yakkan shoumei (import certificate).',
    'American tourist arrested at Narita for bringing Adderall without permit',
    'https://www.mhlw.go.jp/english/policy/health-medical/pharmaceuticals/01.html'
),
(
    (SELECT id FROM countries WHERE code = 'JP'),
    (SELECT id FROM law_categories WHERE name = 'Cultural & Social Respect'),
    null,
    'Tattoos may restrict access to public baths, gyms, and some accommodations',
    'info',
    'While not illegal, visible tattoos are associated with yakuza and may result in denied entry to onsen, sento, pools, and gyms.',
    'Tourist with small wrist tattoo denied entry to famous hot spring resort',
    'https://www.japan.travel/en/plan/tatoo-friendly/'
),
(
    (SELECT id FROM countries WHERE code = 'JP'),
    (SELECT id FROM law_categories WHERE name = 'Photography & Filming'),
    (SELECT id FROM law_subcategories WHERE name = 'Public Photography'),
    'Photography of people without consent can be illegal - upskirt photos severely punished',
    'warning',
    'Taking photos of people without permission, especially women, can result in arrest. Upskirt photography carries up to 1 year imprisonment.',
    'Tourist arrested for taking photos of women on train without permission',
    'https://www.gov.uk/foreign-travel-advice/japan/local-laws-and-customs'
);

-- Insert enhanced country laws for UK
INSERT INTO country_laws (country_id, category_id, subcategory_id, summary, severity, details, scenario, source_url) VALUES 
(
    (SELECT id FROM countries WHERE code = 'GB'),
    (SELECT id FROM law_categories WHERE name = 'Transport & Driving'),
    (SELECT id FROM law_subcategories WHERE name = 'Road Rules'),
    'Drive on left, strict speed limits with automated enforcement',
    'warning',
    'Speed cameras are everywhere and automatically issue fines. Drink-drive limit is 80mg/100ml blood (lower than many countries).',
    'Tourist receives £100 fine and 3 penalty points for exceeding 30mph limit by 5mph',
    'https://www.gov.uk/speed-limits'
),
(
    (SELECT id FROM countries WHERE code = 'GB'),
    (SELECT id FROM law_categories WHERE name = 'Alcohol'),
    null,
    'Must be 18+ to buy alcohol, licensing hours vary by location',
    'info',
    'Pubs typically close at 11pm Sunday-Thursday, midnight Friday-Saturday. Some areas have 24-hour licenses. Public drinking generally allowed.',
    'Tourist confused by pub closing at 11pm on Tuesday night',
    'https://www.gov.uk/alcohol-licensing'
),
(
    (SELECT id FROM countries WHERE code = 'GB'),
    (SELECT id FROM law_categories WHERE name = 'Customs & Imports'),
    null,
    'Duty-free allowances: 200 cigarettes, 4L wine, 16L beer, £390 other goods',
    'info',
    'Exceeding duty-free limits requires declaration and payment of customs duty. Bringing meat, dairy, or plant products from non-EU countries is restricted.',
    'Tourist pays £50 duty on extra bottle of whisky brought from US',
    'https://www.gov.uk/duty-free-goods'
);

-- Insert emergency contacts for Thailand
INSERT INTO emergency_contacts (country_id, contact_type, name, phone, address, email, website) VALUES 
(
    (SELECT id FROM countries WHERE code = 'TH'),
    'police',
    'Tourist Police',
    '1155',
    'Various locations throughout Thailand',
    'info@touristpolice.go.th',
    'https://www.touristpolice.go.th'
),
(
    (SELECT id FROM countries WHERE code = 'TH'),
    'embassy',
    'US Embassy Bangkok',
    '+66-2-205-4000',
    '95 Wireless Road, Bangkok 10330',
    'acsbkk@state.gov',
    'https://th.usembassy.gov'
),
(
    (SELECT id FROM countries WHERE code = 'TH'),
    'medical',
    'Emergency Medical Services',
    '1669',
    'Nationwide emergency service',
    null,
    null
);

-- Insert emergency contacts for Japan
INSERT INTO emergency_contacts (country_id, contact_type, name, phone, address, email, website) VALUES 
(
    (SELECT id FROM countries WHERE code = 'JP'),
    'police',
    'Japan Police',
    '110',
    'Nationwide emergency number',
    null,
    null
),
(
    (SELECT id FROM countries WHERE code = 'JP'),
    'embassy',
    'US Embassy Tokyo',
    '+81-3-3224-5000',
    '1-10-5 Akasaka, Minato-ku, Tokyo 107-8420',
    'TokyoACS@state.gov',
    'https://jp.usembassy.gov'
),
(
    (SELECT id FROM countries WHERE code = 'JP'),
    'medical',
    'Emergency Medical/Fire',
    '119',
    'Nationwide emergency service',
    null,
    null
);

-- Insert emergency contacts for UK
INSERT INTO emergency_contacts (country_id, contact_type, name, phone, address, email, website) VALUES 
(
    (SELECT id FROM countries WHERE code = 'GB'),
    'police',
    'UK Police Emergency',
    '999',
    'Nationwide emergency number',
    null,
    null
),
(
    (SELECT id FROM countries WHERE code = 'GB'),
    'embassy',
    'US Embassy London',
    '+44-20-7499-9000',
    '33 Nine Elms Lane, London SW11 7US',
    'SCSLondon@state.gov',
    'https://uk.usembassy.gov'
),
(
    (SELECT id FROM countries WHERE code = 'GB'),
    'medical',
    'NHS Emergency',
    '999',
    'Nationwide emergency service',
    null,
    'https://www.nhs.uk'
);
