-- Create the missing country_faqs table that the API route expects
CREATE TABLE IF NOT EXISTS country_faqs (
    id SERIAL PRIMARY KEY,
    country_id INTEGER NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    priority INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add some sample FAQ data for testing
INSERT INTO country_faqs (country_id, question, answer, category, priority) VALUES
-- Thailand FAQs
(1, 'Can I bring prescription medication to Thailand?', 'Yes, but you must carry a prescription or medical certificate. Some medications require prior approval from Thai authorities.', 'Health & Safety', 1),
(1, 'What should I know about Thai traffic laws?', 'Drive on the left side. International driving permits are required. Helmet laws are strictly enforced for motorcycles.', 'Transportation', 2),
(1, 'Are there restrictions on photography in Thailand?', 'Avoid photographing military installations, government buildings, and always ask permission before photographing people.', 'Cultural Etiquette', 3),

-- Japan FAQs  
(2, 'What items are prohibited in Japan?', 'Narcotics, firearms, certain medications, and large amounts of cash must be declared. Some over-the-counter medicines from other countries are banned.', 'Customs & Immigration', 1),
(2, 'How strict are noise regulations in Japan?', 'Very strict. Avoid loud conversations on trains, keep music low, and be mindful of noise levels especially at night.', 'Social Conduct', 2),
(2, 'Can I use my credit card everywhere in Japan?', 'Japan is still largely cash-based. Many small businesses only accept cash, so always carry yen.', 'Financial', 3);
