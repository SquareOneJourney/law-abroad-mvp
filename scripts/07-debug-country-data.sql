-- Debug script to check what countries exist in the database
-- This will help identify why only US is showing

-- Check all distinct country codes in laws table
SELECT 'Distinct country codes in laws table:' as debug_info;
SELECT DISTINCT country_code, COUNT(*) as law_count 
FROM laws 
WHERE country_code IS NOT NULL 
GROUP BY country_code 
ORDER BY country_code;

-- Check countries table
SELECT 'Countries in countries table:' as debug_info;
SELECT code, name FROM countries ORDER BY code;

-- Check if there are any laws without country_code
SELECT 'Laws without country_code:' as debug_info;
SELECT COUNT(*) as laws_without_country_code FROM laws WHERE country_code IS NULL;

-- Check sample of laws data
SELECT 'Sample laws data:' as debug_info;
SELECT country_code, category, title, created_at 
FROM laws 
ORDER BY created_at DESC 
LIMIT 10;

-- Check if there are any filtering issues
SELECT 'Laws by country with details:' as debug_info;
SELECT 
    l.country_code, 
    c.name as country_name,
    COUNT(*) as law_count,
    MAX(l.last_verified) as most_recent_verification
FROM laws l
LEFT JOIN countries c ON l.country_code = c.code
WHERE l.country_code IS NOT NULL
GROUP BY l.country_code, c.name
ORDER BY l.country_code;
