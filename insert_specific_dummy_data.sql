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

-- Generate 100 TML records across 15 circuits
DO $$
DECLARE
    circuit_names TEXT[] := ARRAY[
        'PIPE-100-CS', 'VESSEL-200-SS', 'TANK-300-CS', 'REACTOR-400-SS316', 'EXCHANGER-500-CS',
        'COLUMN-600-SS', 'DRUM-700-CS', 'PIPE-800-SS316', 'VESSEL-900-CS', 'TANK-1000-SS',
        'REACTOR-1100-CS', 'EXCHANGER-1200-SS316', 'COLUMN-1300-CS', 'DRUM-1400-SS', 'PIPE-1500-CS'
    ];
    circuit_name TEXT;
    tml_counter INTEGER := 1;
    tmls_per_circuit INTEGER;
    remainder INTEGER;
    i INTEGER;
    j INTEGER;
BEGIN
    -- Calculate TMLs per circuit (distribute 100 across 15 circuits)
    tmls_per_circuit := 100 / 15;  -- 6 TMLs per circuit base
    remainder := 100 % 15;         -- 10 extra TMLs to distribute
    
    FOR i IN 1..array_length(circuit_names, 1) LOOP
        circuit_name := circuit_names[i];
        
        -- Some circuits get 7 TMLs (6 + 1 extra), others get 6
        FOR j IN 1..(tmls_per_circuit + CASE WHEN i <= remainder THEN 1 ELSE 0 END) LOOP
            INSERT INTO tmls (circuit_id, tml_id) VALUES 
            (circuit_name, 'TML-' || LPAD(tml_counter::TEXT, 3, '0'));
            tml_counter := tml_counter + 1;
        END LOOP;
    END LOOP;
END $$;

-- Generate measurements for each TML on specific dates with trending patterns
DO $$
DECLARE
    tml_record RECORD;
    base_thickness DOUBLE PRECISION;
    base_corrosion_rate DOUBLE PRECISION;
    base_temperature DOUBLE PRECISION;
    thickness_jan DOUBLE PRECISION;
    thickness_feb DOUBLE PRECISION;
    thickness_mar DOUBLE PRECISION;
    corr_jan DOUBLE PRECISION;
    corr_feb DOUBLE PRECISION;
    corr_mar DOUBLE PRECISION;
    temp_jan DOUBLE PRECISION;
    temp_feb DOUBLE PRECISION;
    temp_mar DOUBLE PRECISION;
    trend_type INTEGER; -- 1 = increasing, 2 = decreasing, 3 = stable
    tml_counter INTEGER := 1;
BEGIN
    -- Loop through each TML
    FOR tml_record IN SELECT id FROM tmls ORDER BY id LOOP
        -- Set unique base characteristics for each TML
        base_thickness := 15.0 + (random() * 10.0); -- Base thickness between 15-25 mm
        base_corrosion_rate := 10.0 + (random() * 80.0); -- Base corrosion rate between 10-90 mpy
        base_temperature := 50.0 + (random() * 100.0); -- Base temperature between 50-150°C
        
        -- Determine trend type based on TML number
        -- 40% increasing, 40% decreasing, 20% stable
        IF tml_counter <= 40 THEN
            trend_type := 1; -- Increasing trend
        ELSIF tml_counter <= 80 THEN
            trend_type := 2; -- Decreasing trend  
        ELSE
            trend_type := 3; -- Stable trend
        END IF;
        
        -- Calculate corrosion and temperature trends
        IF trend_type = 1 THEN
            -- INCREASING TREND: Corrosion and temperature increase Jan -> Feb -> Mar
            corr_jan := base_corrosion_rate - (5.0 + random() * 10.0); -- Start lower
            corr_feb := base_corrosion_rate + (random() * 5.0); -- Medium
            corr_mar := base_corrosion_rate + (10.0 + random() * 15.0); -- End higher
            
            temp_jan := base_temperature - (5.0 + random() * 15.0); -- Start cooler
            temp_feb := base_temperature + (random() * 10.0); -- Medium
            temp_mar := base_temperature + (15.0 + random() * 25.0); -- End hotter
            
        ELSIF trend_type = 2 THEN
            -- DECREASING TREND: Corrosion and temperature decrease Jan -> Feb -> Mar
            corr_jan := base_corrosion_rate + (10.0 + random() * 15.0); -- Start higher
            corr_feb := base_corrosion_rate + (random() * 5.0); -- Medium
            corr_mar := base_corrosion_rate - (5.0 + random() * 10.0); -- End lower
            
            temp_jan := base_temperature + (15.0 + random() * 25.0); -- Start hotter
            temp_feb := base_temperature + (random() * 10.0); -- Medium
            temp_mar := base_temperature - (5.0 + random() * 15.0); -- End cooler
            
        ELSE
            -- STABLE TREND: Minor variations around base values
            corr_jan := base_corrosion_rate + (random() * 10.0 - 5.0);
            corr_feb := base_corrosion_rate + (random() * 10.0 - 5.0);
            corr_mar := base_corrosion_rate + (random() * 10.0 - 5.0);
            
            temp_jan := base_temperature + (random() * 20.0 - 10.0);
            temp_feb := base_temperature + (random() * 20.0 - 10.0);
            temp_mar := base_temperature + (random() * 20.0 - 10.0);
        END IF;
        
        -- Ensure values are within valid ranges
        corr_jan := GREATEST(1.0, LEAST(100.0, corr_jan));
        corr_feb := GREATEST(1.0, LEAST(100.0, corr_feb));
        corr_mar := GREATEST(1.0, LEAST(100.0, corr_mar));
        
        temp_jan := GREATEST(20.0, LEAST(200.0, temp_jan));
        temp_feb := GREATEST(20.0, LEAST(200.0, temp_feb));
        temp_mar := GREATEST(20.0, LEAST(200.0, temp_mar));
        
        -- Calculate thickness progression (always decreasing due to corrosion)
        thickness_jan := base_thickness;
        thickness_feb := base_thickness - (corr_feb * 0.0254 / 12); -- 1 month corrosion
        thickness_mar := base_thickness - (corr_mar * 0.0254 * 2 / 12); -- 2 months corrosion
        
        -- Insert January measurement
        INSERT INTO measurements (tml_record_id, measurement_date, thickness, temperature, corrosion_rate)
        VALUES (
            tml_record.id,
            '2025-01-01'::DATE,
            ROUND(thickness_jan::NUMERIC, 3),
            ROUND(temp_jan::NUMERIC, 2),
            ROUND(corr_jan::NUMERIC, 2)
        );
        
        -- Insert February measurement
        INSERT INTO measurements (tml_record_id, measurement_date, thickness, temperature, corrosion_rate)
        VALUES (
            tml_record.id,
            '2025-02-01'::DATE,
            ROUND(thickness_feb::NUMERIC, 3),
            ROUND(temp_feb::NUMERIC, 2),
            ROUND(corr_feb::NUMERIC, 2)
        );
        
        -- Insert March measurement
        INSERT INTO measurements (tml_record_id, measurement_date, thickness, temperature, corrosion_rate)
        VALUES (
            tml_record.id,
            '2025-03-01'::DATE,
            ROUND(thickness_mar::NUMERIC, 3),
            ROUND(temp_mar::NUMERIC, 2),
            ROUND(corr_mar::NUMERIC, 2)
        );
        
        tml_counter := tml_counter + 1;
    END LOOP;
END $$;

-- Verify the data insertion
SELECT 
    'Data insertion complete!' as status,
    (SELECT COUNT(*) FROM tmls) as tml_count,
    (SELECT COUNT(*) FROM measurements) as measurement_count,
    (SELECT COUNT(DISTINCT measurement_date) FROM measurements) as unique_dates,
    (SELECT COUNT(DISTINCT circuit_id) FROM tmls) as circuit_count;

-- Show sample of trending data (increasing TMLs 1-5)
SELECT 
    t.circuit_id,
    t.tml_id,
    m.measurement_date,
    m.thickness,
    m.corrosion_rate as "corrosion_rate_mpy",
    m.temperature,
    'INCREASING' as trend_type
FROM tmls t
JOIN measurements m ON t.id = m.tml_record_id
WHERE t.id <= 5
ORDER BY t.id, m.measurement_date;

-- Show sample of decreasing trend data (TMLs 41-45)
SELECT 
    t.circuit_id,
    t.tml_id,
    m.measurement_date,
    m.thickness,
    m.corrosion_rate as "corrosion_rate_mpy",
    m.temperature,
    'DECREASING' as trend_type
FROM tmls t
JOIN measurements m ON t.id = m.tml_record_id
WHERE t.id BETWEEN 41 AND 45
ORDER BY t.id, m.measurement_date;

-- Show circuit distribution
SELECT 
    circuit_id,
    COUNT(*) as tml_count
FROM tmls
GROUP BY circuit_id
ORDER BY circuit_id;

-- Show summary statistics by date
SELECT 
    measurement_date,
    COUNT(*) as measurements_per_date,
    ROUND(MIN(corrosion_rate)::NUMERIC, 2) as min_corrosion_mpy,
    ROUND(MAX(corrosion_rate)::NUMERIC, 2) as max_corrosion_mpy,
    ROUND(AVG(corrosion_rate)::NUMERIC, 2) as avg_corrosion_mpy,
    ROUND(MIN(temperature)::NUMERIC, 2) as min_temp,
    ROUND(MAX(temperature)::NUMERIC, 2) as max_temp,
    ROUND(AVG(temperature)::NUMERIC, 2) as avg_temp
FROM measurements
GROUP BY measurement_date
ORDER BY measurement_date;