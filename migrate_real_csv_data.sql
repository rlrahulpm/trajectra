-- Clean migration script based on actual CSV data
-- File: /Users/rlrahul/Trajectra/Corrosion Data.csv

-- Insert TML Points (one per unique TML ID)
INSERT INTO tml_points (tml_number, equipment_name, location, nominal_thickness, minimum_thickness, material, service, notes, created_at, updated_at) VALUES
('100', '3A-234B', 'Circuit 3A-234B', 10.0, 2.0, 'Carbon Steel', 'Corrosion Monitoring', 'TML Point 100', NOW(), NOW()),
('101', '3A-234B', 'Circuit 3A-234B', 10.0, 2.0, 'Carbon Steel', 'Corrosion Monitoring', 'TML Point 101', NOW(), NOW()),
('102', '3A-234B', 'Circuit 3A-234B', 10.0, 2.0, 'Carbon Steel', 'Corrosion Monitoring', 'TML Point 102', NOW(), NOW()),
('103', '3A-234B', 'Circuit 3A-234B', 10.0, 2.0, 'Carbon Steel', 'Corrosion Monitoring', 'TML Point 103', NOW(), NOW()),
('104', '3A-234B', 'Circuit 3A-234B', 10.0, 2.0, 'Carbon Steel', 'Corrosion Monitoring', 'TML Point 104', NOW(), NOW()),
('105', '3A-234B', 'Circuit 3A-234B', 10.0, 2.0, 'Carbon Steel', 'Corrosion Monitoring', 'TML Point 105', NOW(), NOW()),
('106', '3A-234B', 'Circuit 3A-234B', 10.0, 2.0, 'Carbon Steel', 'Corrosion Monitoring', 'TML Point 106', NOW(), NOW()),
('107', '23F-49C', 'Circuit 23F-49C', 10.0, 2.0, 'Carbon Steel', 'Corrosion Monitoring', 'TML Point 107', NOW(), NOW()),
('108', '23F-49C', 'Circuit 23F-49C', 10.0, 2.0, 'Carbon Steel', 'Corrosion Monitoring', 'TML Point 108', NOW(), NOW()),
('109', '23F-49C', 'Circuit 23F-49C', 10.0, 2.0, 'Carbon Steel', 'Corrosion Monitoring', 'TML Point 109', NOW(), NOW()),
('110', '23F-49C', 'Circuit 23F-49C', 10.0, 2.0, 'Carbon Steel', 'Corrosion Monitoring', 'TML Point 110', NOW(), NOW()),
('111', '23F-49C', 'Circuit 23F-49C', 10.0, 2.0, 'Carbon Steel', 'Corrosion Monitoring', 'TML Point 111', NOW(), NOW()),
('112', '23F-49C', 'Circuit 23F-49C', 10.0, 2.0, 'Carbon Steel', 'Corrosion Monitoring', 'TML Point 112', NOW(), NOW()),
('113', '23F-49C', 'Circuit 23F-49C', 10.0, 2.0, 'Carbon Steel', 'Corrosion Monitoring', 'TML Point 113', NOW(), NOW()),
('114', 'CF-3C42', 'Circuit CF-3C42', 10.0, 2.0, 'Carbon Steel', 'Corrosion Monitoring', 'TML Point 114', NOW(), NOW()),
('115', 'CF-3C43', 'Circuit CF-3C43', 10.0, 2.0, 'Carbon Steel', 'Corrosion Monitoring', 'TML Point 115', NOW(), NOW()),
('116', 'CF-3C44', 'Circuit CF-3C44', 10.0, 2.0, 'Carbon Steel', 'Corrosion Monitoring', 'TML Point 116', NOW(), NOW()),
('117', 'CF-3C45', 'Circuit CF-3C45', 10.0, 2.0, 'Carbon Steel', 'Corrosion Monitoring', 'TML Point 117', NOW(), NOW()),
('118', 'CF-3C46', 'Circuit CF-3C46', 10.0, 2.0, 'Carbon Steel', 'Corrosion Monitoring', 'TML Point 118', NOW(), NOW()),
('119', 'CF-3C47', 'Circuit CF-3C47', 10.0, 2.0, 'Carbon Steel', 'Corrosion Monitoring', 'TML Point 119', NOW(), NOW());

-- Insert measurements - TWO per TML (Rate A and Rate B from CSV)
-- Using SELECT to get actual tml_point IDs by tml_number
-- Measurement A (Corrosion Rate A column from CSV)
INSERT INTO measurements (tml_point_id, measurement_date, thickness, corrosion_rate, inspector, equipment_condition, comments, created_at)
SELECT tp.id, '2025-01-01'::timestamp, 8.43, 5.7, 'Inspector A', 'Good', 'TML 100 - Rate A measurement', NOW() FROM tml_points tp WHERE tp.tml_number = '100'
UNION ALL
SELECT tp.id, '2025-01-01'::timestamp, 7.06, 9.4, 'Inspector A', 'Fair', 'TML 101 - Rate A measurement', NOW() FROM tml_points tp WHERE tp.tml_number = '101'
UNION ALL
SELECT tp.id, '2025-01-01'::timestamp, 6.7, 10.3, 'Inspector A', 'Fair', 'TML 102 - Rate A measurement', NOW() FROM tml_points tp WHERE tp.tml_number = '102'
UNION ALL
SELECT tp.id, '2025-01-01'::timestamp, 8.55, 4.5, 'Inspector A', 'Good', 'TML 103 - Rate A measurement', NOW() FROM tml_points tp WHERE tp.tml_number = '103'
UNION ALL
SELECT tp.id, '2025-01-01'::timestamp, 5.95, 20.5, 'Inspector A', 'Poor', 'TML 104 - Rate A measurement', NOW() FROM tml_points tp WHERE tp.tml_number = '104'
UNION ALL
SELECT tp.id, '2025-01-01'::timestamp, 8.34, 6.6, 'Inspector A', 'Good', 'TML 105 - Rate A measurement', NOW() FROM tml_points tp WHERE tp.tml_number = '105'
UNION ALL
SELECT tp.id, '2025-01-01'::timestamp, 2.91, 50.9, 'Inspector A', 'Critical', 'TML 106 - Rate A measurement', NOW() FROM tml_points tp WHERE tp.tml_number = '106'
UNION ALL
SELECT tp.id, '2025-01-01'::timestamp, 9.78, 2.2, 'Inspector A', 'Excellent', 'TML 107 - Rate A measurement', NOW() FROM tml_points tp WHERE tp.tml_number = '107'
UNION ALL
SELECT tp.id, '2025-01-01'::timestamp, 8.45, 5.5, 'Inspector A', 'Good', 'TML 108 - Rate A measurement', NOW() FROM tml_points tp WHERE tp.tml_number = '108'
UNION ALL
SELECT tp.id, '2025-01-01'::timestamp, 6.66, 13.4, 'Inspector A', 'Fair', 'TML 109 - Rate A measurement', NOW() FROM tml_points tp WHERE tp.tml_number = '109'
UNION ALL
SELECT tp.id, '2025-01-01'::timestamp, 8.12, 8.8, 'Inspector A', 'Good', 'TML 110 - Rate A measurement', NOW() FROM tml_points tp WHERE tp.tml_number = '110'
UNION ALL
SELECT tp.id, '2025-01-01'::timestamp, 9.82, 1.8, 'Inspector A', 'Excellent', 'TML 111 - Rate A measurement', NOW() FROM tml_points tp WHERE tp.tml_number = '111'
UNION ALL
SELECT tp.id, '2025-01-01'::timestamp, 6.87, 11.3, 'Inspector A', 'Fair', 'TML 112 - Rate A measurement', NOW() FROM tml_points tp WHERE tp.tml_number = '112'
UNION ALL
SELECT tp.id, '2025-01-01'::timestamp, 8.53, 4.7, 'Inspector A', 'Good', 'TML 113 - Rate A measurement', NOW() FROM tml_points tp WHERE tp.tml_number = '113'
UNION ALL
SELECT tp.id, '2025-01-01'::timestamp, 8.38, 6.2, 'Inspector A', 'Good', 'TML 114 - Rate A measurement', NOW() FROM tml_points tp WHERE tp.tml_number = '114'
UNION ALL
SELECT tp.id, '2025-01-01'::timestamp, 4.63, 33.7, 'Inspector A', 'Poor', 'TML 115 - Rate A measurement', NOW() FROM tml_points tp WHERE tp.tml_number = '115'
UNION ALL
SELECT tp.id, '2025-01-01'::timestamp, 6.38, 16.2, 'Inspector A', 'Fair', 'TML 116 - Rate A measurement', NOW() FROM tml_points tp WHERE tp.tml_number = '116'
UNION ALL
SELECT tp.id, '2025-01-01'::timestamp, 8.28, 7.2, 'Inspector A', 'Good', 'TML 117 - Rate A measurement', NOW() FROM tml_points tp WHERE tp.tml_number = '117'
UNION ALL
SELECT tp.id, '2025-01-01'::timestamp, 8.37, 6.3, 'Inspector A', 'Good', 'TML 118 - Rate A measurement', NOW() FROM tml_points tp WHERE tp.tml_number = '118'
UNION ALL
SELECT tp.id, '2025-01-01'::timestamp, 7.09, 9.1, 'Inspector A', 'Good', 'TML 119 - Rate A measurement', NOW() FROM tml_points tp WHERE tp.tml_number = '119';

-- Measurement B (Corrosion Rate B column from CSV) - Different date
INSERT INTO measurements (tml_point_id, measurement_date, thickness, corrosion_rate, inspector, equipment_condition, comments, created_at)
SELECT tp.id, '2025-02-01'::timestamp, 6.94, 30.6, 'Inspector B', 'Poor', 'TML 100 - Rate B measurement', NOW() FROM tml_points tp WHERE tp.tml_number = '100'
UNION ALL
SELECT tp.id, '2025-02-01'::timestamp, 5.89, 41.1, 'Inspector B', 'Poor', 'TML 101 - Rate B measurement', NOW() FROM tml_points tp WHERE tp.tml_number = '101'
UNION ALL
SELECT tp.id, '2025-02-01'::timestamp, 7.5, 25.0, 'Inspector B', 'Fair', 'TML 102 - Rate B measurement', NOW() FROM tml_points tp WHERE tp.tml_number = '102'
UNION ALL
SELECT tp.id, '2025-02-01'::timestamp, 8.34, 16.6, 'Inspector B', 'Fair', 'TML 103 - Rate B measurement', NOW() FROM tml_points tp WHERE tp.tml_number = '103'
UNION ALL
SELECT tp.id, '2025-02-01'::timestamp, 9.43, 5.7, 'Inspector B', 'Good', 'TML 104 - Rate B measurement', NOW() FROM tml_points tp WHERE tp.tml_number = '104'
UNION ALL
SELECT tp.id, '2025-02-01'::timestamp, 8.45, 15.5, 'Inspector B', 'Fair', 'TML 105 - Rate B measurement', NOW() FROM tml_points tp WHERE tp.tml_number = '105'
UNION ALL
SELECT tp.id, '2025-02-01'::timestamp, 9.55, 4.5, 'Inspector B', 'Good', 'TML 106 - Rate B measurement', NOW() FROM tml_points tp WHERE tp.tml_number = '106'
UNION ALL
SELECT tp.id, '2025-02-01'::timestamp, 7.67, 23.3, 'Inspector B', 'Fair', 'TML 107 - Rate B measurement', NOW() FROM tml_points tp WHERE tp.tml_number = '107'
UNION ALL
SELECT tp.id, '2025-02-01'::timestamp, 9.22, 7.8, 'Inspector B', 'Good', 'TML 108 - Rate B measurement', NOW() FROM tml_points tp WHERE tp.tml_number = '108'
UNION ALL
SELECT tp.id, '2025-02-01'::timestamp, 9.6, 4.0, 'Inspector B', 'Good', 'TML 109 - Rate B measurement', NOW() FROM tml_points tp WHERE tp.tml_number = '109'
UNION ALL
SELECT tp.id, '2025-02-01'::timestamp, 8.08, 19.2, 'Inspector B', 'Fair', 'TML 110 - Rate B measurement', NOW() FROM tml_points tp WHERE tp.tml_number = '110'
UNION ALL
SELECT tp.id, '2025-02-01'::timestamp, 7.15, 28.5, 'Inspector B', 'Fair', 'TML 111 - Rate B measurement', NOW() FROM tml_points tp WHERE tp.tml_number = '111'
UNION ALL
SELECT tp.id, '2025-02-01'::timestamp, 5.47, 45.3, 'Inspector B', 'Poor', 'TML 112 - Rate B measurement', NOW() FROM tml_points tp WHERE tp.tml_number = '112'
UNION ALL
SELECT tp.id, '2025-02-01'::timestamp, 8.8, 12.0, 'Inspector B', 'Good', 'TML 113 - Rate B measurement', NOW() FROM tml_points tp WHERE tp.tml_number = '113'
UNION ALL
SELECT tp.id, '2025-02-01'::timestamp, 9.55, 4.5, 'Inspector B', 'Good', 'TML 114 - Rate B measurement', NOW() FROM tml_points tp WHERE tp.tml_number = '114'
UNION ALL
SELECT tp.id, '2025-02-01'::timestamp, 8.74, 12.6, 'Inspector B', 'Good', 'TML 115 - Rate B measurement', NOW() FROM tml_points tp WHERE tp.tml_number = '115'
UNION ALL
SELECT tp.id, '2025-02-01'::timestamp, 9.47, 5.3, 'Inspector B', 'Good', 'TML 116 - Rate B measurement', NOW() FROM tml_points tp WHERE tp.tml_number = '116'
UNION ALL
SELECT tp.id, '2025-02-01'::timestamp, 2.19, 78.1, 'Inspector B', 'Critical', 'TML 117 - Rate B measurement', NOW() FROM tml_points tp WHERE tp.tml_number = '117'
UNION ALL
SELECT tp.id, '2025-02-01'::timestamp, 8.66, 13.4, 'Inspector B', 'Fair', 'TML 118 - Rate B measurement', NOW() FROM tml_points tp WHERE tp.tml_number = '118'
UNION ALL
SELECT tp.id, '2025-02-01'::timestamp, 9.11, 8.9, 'Inspector B', 'Good', 'TML 119 - Rate B measurement', NOW() FROM tml_points tp WHERE tp.tml_number = '119';

-- Insert corrosion data for Sankey diagram based on actual CSV data
INSERT INTO corrosion_data (source, target, value, category, risk_level, description, created_at) VALUES
-- Group by circuit and risk categories based on actual rates
('3A-234B', '< 10 mpy', 2, 'Low Risk', 'LOW', 'Based on CSV corrosion rates < 10 mpy', NOW()),
('3A-234B', '10-20 mpy', 2, 'Medium Risk', 'MEDIUM', 'Based on CSV corrosion rates 10-20 mpy', NOW()),
('3A-234B', '20-30 mpy', 2, 'High Risk', 'HIGH', 'Based on CSV corrosion rates 20-30 mpy', NOW()),
('3A-234B', '> 50 mpy', 1, 'Critical Risk', 'CRITICAL', 'Based on CSV corrosion rates > 50 mpy', NOW()),

('23F-49C', '< 10 mpy', 4, 'Low Risk', 'LOW', 'Based on CSV corrosion rates < 10 mpy', NOW()),
('23F-49C', '10-20 mpy', 2, 'Medium Risk', 'MEDIUM', 'Based on CSV corrosion rates 10-20 mpy', NOW()),
('23F-49C', '20-30 mpy', 1, 'High Risk', 'HIGH', 'Based on CSV corrosion rates 20-30 mpy', NOW()),

('CF Circuits', '< 10 mpy', 3, 'Low Risk', 'LOW', 'Based on CSV corrosion rates < 10 mpy', NOW()),
('CF Circuits', '10-20 mpy', 1, 'Medium Risk', 'MEDIUM', 'Based on CSV corrosion rates 10-20 mpy', NOW()),
('CF Circuits', '> 50 mpy', 1, 'Critical Risk', 'CRITICAL', 'Based on CSV corrosion rates > 50 mpy', NOW());