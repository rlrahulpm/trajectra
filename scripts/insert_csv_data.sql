-- Insert CSV data into PostgreSQL tables

-- First, let's insert some TML Points
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

-- Now insert corrosion data for Sankey diagram (using source circuit, target category, and value)
INSERT INTO corrosion_data (source, target, value, category, risk_level, description, created_at) VALUES
('3A-234B', '< 10 mpy', 3, 'Low Risk', 'LOW', 'Circuit 3A-234B with corrosion rate < 10 mpy', NOW()),
('3A-234B', '10-20 mpy', 2, 'Medium Risk', 'MEDIUM', 'Circuit 3A-234B with corrosion rate 10-20 mpy', NOW()),
('3A-234B', '30-50 mpy', 1, 'High Risk', 'HIGH', 'Circuit 3A-234B with corrosion rate 30-50 mpy', NOW()),
('3A-234B', '> 50 mpy', 1, 'Very High Risk', 'CRITICAL', 'Circuit 3A-234B with corrosion rate > 50 mpy', NOW()),

('23F-49C', '< 10 mpy', 4, 'Low Risk', 'LOW', 'Circuit 23F-49C with corrosion rate < 10 mpy', NOW()),
('23F-49C', '10-20 mpy', 2, 'Medium Risk', 'MEDIUM', 'Circuit 23F-49C with corrosion rate 10-20 mpy', NOW()),
('23F-49C', '20-30 mpy', 1, 'High Risk', 'HIGH', 'Circuit 23F-49C with corrosion rate 20-30 mpy', NOW()),

('CF-3C42', '< 10 mpy', 1, 'Low Risk', 'LOW', 'Circuit CF-3C42 with corrosion rate < 10 mpy', NOW()),
('CF-3C43', '10-20 mpy', 1, 'Medium Risk', 'MEDIUM', 'Circuit CF-3C43 with corrosion rate 10-20 mpy', NOW()),
('CF-3C44', '10-20 mpy', 1, 'Medium Risk', 'MEDIUM', 'Circuit CF-3C44 with corrosion rate 10-20 mpy', NOW()),
('CF-3C45', '> 50 mpy', 1, 'Very High Risk', 'CRITICAL', 'Circuit CF-3C45 with corrosion rate > 50 mpy', NOW()),
('CF-3C46', '10-20 mpy', 1, 'Medium Risk', 'MEDIUM', 'Circuit CF-3C46 with corrosion rate 10-20 mpy', NOW()),
('CF-3C47', '< 10 mpy', 1, 'Low Risk', 'LOW', 'Circuit CF-3C47 with corrosion rate < 10 mpy', NOW());

-- Insert some sample measurements based on CSV data
INSERT INTO measurements (tml_point_id, measurement_date, thickness, corrosion_rate, inspector, equipment_condition, comments, created_at) VALUES
-- For TML Point 100 (3A-234B)
(1, '2025-01-01', 8.5, 5.7, 'John Smith', 'Good', 'Regular inspection - Circuit 3A-234B TML 100', NOW()),
-- For TML Point 101 (3A-234B) 
(2, '2025-01-01', 7.8, 9.4, 'John Smith', 'Fair', 'Regular inspection - Circuit 3A-234B TML 101', NOW()),
-- For TML Point 102 (3A-234B)
(3, '2025-01-01', 7.2, 10.3, 'John Smith', 'Fair', 'Regular inspection - Circuit 3A-234B TML 102', NOW()),
-- For TML Point 103 (3A-234B)
(4, '2025-01-01', 8.9, 4.5, 'John Smith', 'Good', 'Regular inspection - Circuit 3A-234B TML 103', NOW()),
-- For TML Point 104 (3A-234B)
(5, '2025-01-01', 6.1, 20.5, 'John Smith', 'Poor', 'High corrosion rate - Circuit 3A-234B TML 104', NOW()),
-- For TML Point 105 (3A-234B)
(6, '2025-01-01', 8.2, 6.6, 'John Smith', 'Good', 'Regular inspection - Circuit 3A-234B TML 105', NOW()),
-- For TML Point 106 (3A-234B)
(7, '2025-01-01', 3.1, 50.9, 'John Smith', 'Critical', 'Very high corrosion rate - Circuit 3A-234B TML 106', NOW()),
-- For TML Point 107 (23F-49C)
(8, '2025-01-01', 9.2, 2.2, 'Jane Doe', 'Excellent', 'Low corrosion rate - Circuit 23F-49C TML 107', NOW()),
-- For TML Point 108 (23F-49C)
(9, '2025-01-01', 8.7, 5.5, 'Jane Doe', 'Good', 'Regular inspection - Circuit 23F-49C TML 108', NOW()),
-- For TML Point 109 (23F-49C)
(10, '2025-01-01', 8.0, 13.4, 'Jane Doe', 'Fair', 'Moderate corrosion rate - Circuit 23F-49C TML 109', NOW()),
-- For TML Point 110 (23F-49C)
(11, '2025-01-01', 8.4, 8.8, 'Jane Doe', 'Good', 'Regular inspection - Circuit 23F-49C TML 110', NOW()),
-- For TML Point 111 (23F-49C)
(12, '2025-01-01', 9.4, 1.8, 'Jane Doe', 'Excellent', 'Very low corrosion rate - Circuit 23F-49C TML 111', NOW()),
-- For TML Point 112 (23F-49C)
(13, '2025-01-01', 7.3, 11.3, 'Jane Doe', 'Fair', 'Moderate corrosion rate - Circuit 23F-49C TML 112', NOW()),
-- For TML Point 113 (23F-49C)
(14, '2025-01-01', 8.6, 4.7, 'Jane Doe', 'Good', 'Regular inspection - Circuit 23F-49C TML 113', NOW()),
-- For TML Point 114 (CF-3C42)
(15, '2025-01-01', 8.3, 6.2, 'Mike Johnson', 'Good', 'Regular inspection - Circuit CF-3C42 TML 114', NOW()),
-- For TML Point 115 (CF-3C43)
(16, '2025-01-01', 5.8, 33.7, 'Mike Johnson', 'Poor', 'High corrosion rate - Circuit CF-3C43 TML 115', NOW()),
-- For TML Point 116 (CF-3C44)
(17, '2025-01-01', 7.1, 16.2, 'Mike Johnson', 'Fair', 'Moderate corrosion rate - Circuit CF-3C44 TML 116', NOW()),
-- For TML Point 117 (CF-3C45)
(18, '2025-01-01', 2.8, 7.2, 'Mike Johnson', 'Critical', 'Very high corrosion - Circuit CF-3C45 TML 117', NOW()),
-- For TML Point 118 (CF-3C46)
(19, '2025-01-01', 8.1, 6.3, 'Mike Johnson', 'Good', 'Regular inspection - Circuit CF-3C46 TML 118', NOW()),
-- For TML Point 119 (CF-3C47)
(20, '2025-01-01', 8.0, 9.1, 'Mike Johnson', 'Good', 'Regular inspection - Circuit CF-3C47 TML 119', NOW());