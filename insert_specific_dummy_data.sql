-- Clear all existing data
TRUNCATE TABLE measurements CASCADE;
TRUNCATE TABLE tmls CASCADE;
TRUNCATE TABLE classifications CASCADE;

-- Insert Classifications for corrosion rate categories (in mpy)
INSERT INTO classifications (classification_type, min_value, max_value, range_label) VALUES
('CORROSION_RATE', 0.0, 10.0, 'Low'),
('CORROSION_RATE', 10.0, 25.0, 'Moderate'),
('CORROSION_RATE', 25.0, 50.0, 'High'),
('CORROSION_RATE', 50.0, 100.0, 'Severe'),
('CORROSION_RATE', 100.0, 200.0, 'Critical'),
('THICKNESS', 0.0, 5.0, 'Critical'),
('THICKNESS', 5.0, 10.0, 'Warning'),
('THICKNESS', 10.0, 15.0, 'Acceptable'),
('THICKNESS', 15.0, 50.0, 'Good');

-- Insert 20 TML records with realistic circuit and TML IDs
INSERT INTO tmls (circuit_id, tml_id) VALUES
('PIPE-100-CS', 'TML-001'),
('PIPE-100-CS', 'TML-002'),
('VESSEL-200-SS', 'TML-003'),
('VESSEL-200-SS', 'TML-004'),
('TANK-300-CS', 'TML-005'),
('TANK-300-CS', 'TML-006'),
('PIPE-400-SS316', 'TML-007'),
('PIPE-400-SS316', 'TML-008'),
('REACTOR-500-CS', 'TML-009'),
('REACTOR-500-CS', 'TML-010'),
('EXCHANGER-600-CS', 'TML-011'),
('EXCHANGER-600-CS', 'TML-012'),
('COLUMN-700-SS', 'TML-013'),
('COLUMN-700-SS', 'TML-014'),
('DRUM-800-CS', 'TML-015'),
('DRUM-800-CS', 'TML-016'),
('PIPE-900-CS', 'TML-017'),
('PIPE-900-CS', 'TML-018'),
('VESSEL-1000-SS316', 'TML-019'),
('VESSEL-1000-SS316', 'TML-020');

-- Generate measurements for each TML on specific dates
DO $$
DECLARE
    tml_record RECORD;
    base_thickness DOUBLE PRECISION;
    base_corrosion_rate DOUBLE PRECISION;
    base_temperature DOUBLE PRECISION;
    thickness_jan DOUBLE PRECISION;
    thickness_feb DOUBLE PRECISION;
    thickness_mar DOUBLE PRECISION;
    corrosion_variation DOUBLE PRECISION;
    temp_variation DOUBLE PRECISION;
BEGIN
    -- Loop through each TML
    FOR tml_record IN SELECT id FROM tmls ORDER BY id LOOP
        -- Set unique base characteristics for each TML
        base_thickness := 15.0 + (random() * 10.0); -- Base thickness between 15-25 mm
        base_corrosion_rate := 1.0 + (random() * 99.0); -- Base corrosion rate between 1-100 mpy
        base_temperature := 50.0 + (random() * 100.0); -- Base temperature between 50-150°C
        
        -- Calculate progressive thickness reduction based on corrosion rate
        -- Convert mpy to mm/month (1 mil = 0.0254 mm, 1 year = 12 months)
        thickness_jan := base_thickness;
        thickness_feb := base_thickness - (base_corrosion_rate * 0.0254 / 12);
        thickness_mar := base_thickness - (base_corrosion_rate * 0.0254 * 2 / 12);
        
        -- January 1st, 2025 measurement
        corrosion_variation := base_corrosion_rate + (random() * 10.0 - 5.0); -- ±5 mpy variation
        IF corrosion_variation < 1.0 THEN corrosion_variation := 1.0; END IF;
        IF corrosion_variation > 100.0 THEN corrosion_variation := 100.0; END IF;
        
        temp_variation := base_temperature + (random() * 20.0 - 10.0); -- ±10°C variation
        
        INSERT INTO measurements (tml_record_id, measurement_date, thickness, temperature, corrosion_rate)
        VALUES (
            tml_record.id,
            '2025-01-01'::DATE,
            ROUND(thickness_jan::NUMERIC, 3),
            ROUND(temp_variation::NUMERIC, 2),
            ROUND(corrosion_variation::NUMERIC, 2)
        );
        
        -- February 1st, 2025 measurement
        corrosion_variation := base_corrosion_rate + (random() * 10.0 - 5.0); -- ±5 mpy variation
        IF corrosion_variation < 1.0 THEN corrosion_variation := 1.0; END IF;
        IF corrosion_variation > 100.0 THEN corrosion_variation := 100.0; END IF;
        
        temp_variation := base_temperature + (random() * 20.0 - 10.0); -- ±10°C variation
        
        INSERT INTO measurements (tml_record_id, measurement_date, thickness, temperature, corrosion_rate)
        VALUES (
            tml_record.id,
            '2025-02-01'::DATE,
            ROUND(thickness_feb::NUMERIC, 3),
            ROUND(temp_variation::NUMERIC, 2),
            ROUND(corrosion_variation::NUMERIC, 2)
        );
        
        -- March 1st, 2025 measurement
        corrosion_variation := base_corrosion_rate + (random() * 10.0 - 5.0); -- ±5 mpy variation
        IF corrosion_variation < 1.0 THEN corrosion_variation := 1.0; END IF;
        IF corrosion_variation > 100.0 THEN corrosion_variation := 100.0; END IF;
        
        temp_variation := base_temperature + (random() * 20.0 - 10.0); -- ±10°C variation
        
        INSERT INTO measurements (tml_record_id, measurement_date, thickness, temperature, corrosion_rate)
        VALUES (
            tml_record.id,
            '2025-03-01'::DATE,
            ROUND(thickness_mar::NUMERIC, 3),
            ROUND(temp_variation::NUMERIC, 2),
            ROUND(corrosion_variation::NUMERIC, 2)
        );
    END LOOP;
END $$;

-- Verify the data insertion
SELECT 
    'Data insertion complete!' as status,
    (SELECT COUNT(*) FROM tmls) as tml_count,
    (SELECT COUNT(*) FROM measurements) as measurement_count,
    (SELECT COUNT(DISTINCT measurement_date) FROM measurements) as unique_dates;

-- Show sample of the data
SELECT 
    t.circuit_id,
    t.tml_id,
    m.measurement_date,
    m.thickness,
    m.corrosion_rate as "corrosion_rate_mpy",
    m.temperature
FROM tmls t
JOIN measurements m ON t.id = m.tml_record_id
WHERE t.id <= 3
ORDER BY t.id, m.measurement_date
LIMIT 9;

-- Show summary statistics
SELECT 
    measurement_date,
    COUNT(*) as measurements_per_date,
    ROUND(MIN(corrosion_rate)::NUMERIC, 2) as min_corrosion_mpy,
    ROUND(MAX(corrosion_rate)::NUMERIC, 2) as max_corrosion_mpy,
    ROUND(AVG(corrosion_rate)::NUMERIC, 2) as avg_corrosion_mpy
FROM measurements
GROUP BY measurement_date
ORDER BY measurement_date;