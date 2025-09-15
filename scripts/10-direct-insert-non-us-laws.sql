-- Direct insertion of non-US laws to fix the country selector issue
-- Delete any existing test data first to avoid duplicates
DELETE FROM laws WHERE country_code IN ('JP', 'DE', 'AE');

-- Insert Japanese laws
INSERT INTO laws (
    id,
    country_code,
    title,
    summary,
    category,
    region,
    source_name,
    source_url,
    created_at,
    updated_at,
    last_verified
) VALUES 
(
    gen_random_uuid(),
    'JP',
    'Working Hours and Overtime Regulations',
    'Japan has strict working hour limits. Regular working hours are typically 8 hours per day and 40 hours per week. Overtime work requires employee consent and proper compensation at 125% of regular wages.',
    'Employment Law',
    'National',
    'Ministry of Health, Labour and Welfare',
    'https://www.mhlw.go.jp/english/',
    NOW(),
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'JP',
    'Visa and Immigration Requirements',
    'Foreign nationals must obtain appropriate visas before entering Japan. Work visas require sponsorship from a Japanese employer. Tourist visas allow stays up to 90 days for many countries.',
    'Immigration Law',
    'National',
    'Immigration Services Agency',
    'https://www.isa.go.jp/en/',
    NOW(),
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'JP',
    'Consumer Protection Laws',
    'Japan has comprehensive consumer protection laws including cooling-off periods for certain contracts, mandatory product safety standards, and strict advertising regulations.',
    'Consumer Law',
    'National',
    'Consumer Affairs Agency',
    'https://www.caa.go.jp/en/',
    NOW(),
    NOW(),
    NOW()
);

-- Insert German laws
INSERT INTO laws (
    id,
    country_code,
    title,
    summary,
    category,
    region,
    source_name,
    source_url,
    created_at,
    updated_at,
    last_verified
) VALUES 
(
    gen_random_uuid(),
    'DE',
    'GDPR Data Protection Requirements',
    'Germany strictly enforces GDPR regulations. Companies must obtain explicit consent for data processing, provide data portability rights, and report breaches within 72 hours.',
    'Data Protection',
    'National',
    'Federal Commissioner for Data Protection',
    'https://www.bfdi.bund.de/EN/',
    NOW(),
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'DE',
    'Employment Termination Laws',
    'German employment law provides strong worker protections. Terminations require proper notice periods, just cause, or mutual agreement. Works councils must be consulted for mass layoffs.',
    'Employment Law',
    'National',
    'Federal Ministry of Labour',
    'https://www.bmas.de/EN/',
    NOW(),
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'DE',
    'Business Registration Requirements',
    'All businesses in Germany must register with local authorities. Trade licenses (Gewerbeschein) are required for most commercial activities. Specific regulations apply to different business types.',
    'Business Law',
    'National',
    'Federal Ministry of Economics',
    'https://www.bmwk.de/Navigation/EN/',
    NOW(),
    NOW(),
    NOW()
);

-- Insert UAE laws
INSERT INTO laws (
    id,
    country_code,
    title,
    summary,
    category,
    region,
    source_name,
    source_url,
    created_at,
    updated_at,
    last_verified
) VALUES 
(
    gen_random_uuid(),
    'AE',
    'UAE Labor Law Regulations',
    'UAE Labor Law governs employment relationships. It covers working hours (8 hours/day, 48 hours/week), annual leave entitlements, end-of-service benefits, and termination procedures.',
    'Employment Law',
    'National',
    'Ministry of Human Resources',
    'https://www.mohre.gov.ae/en/',
    NOW(),
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'AE',
    'Business Setup and Licensing',
    'Foreign investors can establish businesses in UAE through mainland companies, free zones, or offshore companies. Each option has different ownership requirements and licensing procedures.',
    'Business Law',
    'National',
    'Department of Economic Development',
    'https://www.economy.gov.ae/english/',
    NOW(),
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'AE',
    'Cybercrime and Data Protection',
    'UAE has comprehensive cybercrime laws covering online fraud, data breaches, and digital privacy. The UAE Data Protection Law requires consent for personal data processing.',
    'Cybersecurity Law',
    'National',
    'Telecommunications and Digital Government',
    'https://tdra.gov.ae/en/',
    NOW(),
    NOW(),
    NOW()
);

-- Verify the insertion
SELECT country_code, COUNT(*) as law_count 
FROM laws 
GROUP BY country_code 
ORDER BY country_code;
