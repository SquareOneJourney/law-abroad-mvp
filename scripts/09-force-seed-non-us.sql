-- Force insert non-US data and debug why it might not be showing
-- First, let's see what's currently in the database

SELECT 'Current laws table contents:' as debug_info;
SELECT country_code, category, title, created_at FROM laws ORDER BY country_code, created_at;

SELECT 'Current countries table contents:' as debug_info;  
SELECT code, name FROM countries ORDER BY code;

-- Now force insert the data (this will skip if it already exists due to ON CONFLICT)
INSERT INTO countries (code, name) VALUES 
('JP', 'Japan'),
('DE', 'Germany'),
('AE', 'United Arab Emirates'),
('TH', 'Thailand'),
('GB', 'United Kingdom'),
('FR', 'France'),
('AU', 'Australia'),
('CA', 'Canada')
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name;

-- Insert sample laws for Japan
INSERT INTO laws (
    country_code, 
    category, 
    title, 
    summary,
    raw_text, 
    source_name, 
    source_url, 
    source_date, 
    last_verified
) VALUES 
(
    'JP',
    'drugs',
    'Cannabis Possession Laws',
    'Possession of any amount of cannabis is strictly prohibited and can result in up to 5 years imprisonment.',
    'Japan has zero tolerance for drug possession. Even small amounts of cannabis can lead to immediate arrest, detention for up to 23 days without bail, and potential imprisonment.',
    'Japan Ministry of Justice',
    'https://www.moj.go.jp/EN/',
    CURRENT_DATE,
    NOW()
),
(
    'JP',
    'cultural',
    'Tattoo Restrictions',
    'Tattoos may restrict access to public baths, gyms, and some accommodations.',
    'While not illegal, visible tattoos are associated with organized crime and may result in denial of service at onsen, public baths, gyms, and some hotels.',
    'Japan Tourism Agency',
    'https://www.jta.or.jp/',
    CURRENT_DATE,
    NOW()
),
(
    'DE',
    'public_behavior',
    'Quiet Hours (Ruhezeit)',
    'Quiet hours must be observed from 10 PM to 6 AM on weekdays and all day Sunday.',
    'Making noise during designated quiet hours can result in fines up to €5,000. This includes loud music, construction work, and even vacuuming.',
    'German Federal Ministry of Justice',
    'https://www.bmjv.de/',
    CURRENT_DATE,
    NOW()
),
(
    'DE',
    'cultural',
    'Nazi Symbol Prohibition',
    'Nazi symbols, gestures, and Holocaust denial are criminal offenses punishable by up to 5 years imprisonment.',
    'Displaying Nazi symbols, performing Nazi salutes, or denying the Holocaust can result in imprisonment. This applies to tourists and includes social media posts.',
    'German Criminal Code',
    'https://www.gesetze-im-internet.de/stgb/',
    CURRENT_DATE,
    NOW()
),
(
    'AE',
    'alcohol',
    'Alcohol Consumption Laws',
    'Alcohol consumption is allowed in licensed venues but prohibited in public places.',
    'Drinking alcohol in public places, being drunk in public, or drinking and driving can result in fines, imprisonment, or deportation.',
    'UAE Government Portal',
    'https://u.ae/',
    CURRENT_DATE,
    NOW()
),
(
    'AE',
    'cultural',
    'Public Displays of Affection',
    'Public displays of affection between couples are illegal and can result in fines or imprisonment.',
    'Kissing, hugging, or other intimate behavior in public is considered indecent and can lead to arrest, especially for unmarried couples.',
    'UAE Federal Law',
    'https://u.ae/en/information-and-services/justice-safety-and-the-law',
    CURRENT_DATE,
    NOW()
)
ON CONFLICT (country_code, category, title) DO NOTHING;

-- Final verification
SELECT 'After insert - Countries with law counts:' as debug_info;
SELECT 
    l.country_code, 
    c.name as country_name,
    COUNT(*) as law_count
FROM laws l
LEFT JOIN countries c ON l.country_code = c.code
GROUP BY l.country_code, c.name
ORDER BY l.country_code;
