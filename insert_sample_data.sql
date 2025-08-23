-- Insert 100 TML IDs across 15 circuits
INSERT INTO tmls (circuit_id, tml_id) VALUES
-- Circuit 3A-234B (7 TMLs)
('3A-234B', '100'),
('3A-234B', '101'),
('3A-234B', '102'),
('3A-234B', '103'),
('3A-234B', '104'),
('3A-234B', '105'),
('3A-234B', '106'),
-- Circuit 23F-49C (7 TMLs)
('23F-49C', '107'),
('23F-49C', '108'),
('23F-49C', '109'),
('23F-49C', '110'),
('23F-49C', '111'),
('23F-49C', '112'),
('23F-49C', '113'),
-- Circuit CF-3C42 (6 TMLs)
('CF-3C42', '114'),
('CF-3C42', '115'),
('CF-3C42', '116'),
('CF-3C42', '117'),
('CF-3C42', '118'),
('CF-3C42', '119'),
-- Circuit CF-3C43 (7 TMLs)
('CF-3C43', '120'),
('CF-3C43', '121'),
('CF-3C43', '122'),
('CF-3C43', '123'),
('CF-3C43', '124'),
('CF-3C43', '125'),
('CF-3C43', '126'),
-- Circuit HP-2A1 (7 TMLs)
('HP-2A1', '127'),
('HP-2A1', '128'),
('HP-2A1', '129'),
('HP-2A1', '130'),
('HP-2A1', '131'),
('HP-2A1', '132'),
('HP-2A1', '133'),
-- Circuit LP-5B2 (6 TMLs)
('LP-5B2', '134'),
('LP-5B2', '135'),
('LP-5B2', '136'),
('LP-5B2', '137'),
('LP-5B2', '138'),
('LP-5B2', '139'),
-- Circuit RT-8X9 (7 TMLs)
('RT-8X9', '140'),
('RT-8X9', '141'),
('RT-8X9', '142'),
('RT-8X9', '143'),
('RT-8X9', '144'),
('RT-8X9', '145'),
('RT-8X9', '146'),
-- Circuit FD-4K2 (6 TMLs)
('FD-4K2', '147'),
('FD-4K2', '148'),
('FD-4K2', '149'),
('FD-4K2', '150'),
('FD-4K2', '151'),
('FD-4K2', '152'),
-- Circuit VX-9M3 (7 TMLs)
('VX-9M3', '153'),
('VX-9M3', '154'),
('VX-9M3', '155'),
('VX-9M3', '156'),
('VX-9M3', '157'),
('VX-9M3', '158'),
('VX-9M3', '159'),
-- Circuit QT-7L5 (6 TMLs)
('QT-7L5', '160'),
('QT-7L5', '161'),
('QT-7L5', '162'),
('QT-7L5', '163'),
('QT-7L5', '164'),
('QT-7L5', '165'),
-- Circuit BN-6P8 (7 TMLs)
('BN-6P8', '166'),
('BN-6P8', '167'),
('BN-6P8', '168'),
('BN-6P8', '169'),
('BN-6P8', '170'),
('BN-6P8', '171'),
('BN-6P8', '172'),
-- Circuit WZ-1Q4 (7 TMLs)
('WZ-1Q4', '173'),
('WZ-1Q4', '174'),
('WZ-1Q4', '175'),
('WZ-1Q4', '176'),
('WZ-1Q4', '177'),
('WZ-1Q4', '178'),
('WZ-1Q4', '179'),
-- Circuit DX-3R7 (6 TMLs)
('DX-3R7', '180'),
('DX-3R7', '181'),
('DX-3R7', '182'),
('DX-3R7', '183'),
('DX-3R7', '184'),
('DX-3R7', '185'),
-- Circuit MK-5T9 (7 TMLs)
('MK-5T9', '186'),
('MK-5T9', '187'),
('MK-5T9', '188'),
('MK-5T9', '189'),
('MK-5T9', '190'),
('MK-5T9', '191'),
('MK-5T9', '192'),
-- Circuit ZR-8V2 (7 TMLs)
('ZR-8V2', '193'),
('ZR-8V2', '194'),
('ZR-8V2', '195'),
('ZR-8V2', '196'),
('ZR-8V2', '197'),
('ZR-8V2', '198'),
('ZR-8V2', '199');

-- Insert measurements for all 100 TMLs for Jan 1, Feb 1, Mar 1 2025
-- Using DO block to generate measurements for all TMLs
DO $$
DECLARE
    tml_record RECORD;
BEGIN
    FOR tml_record IN SELECT id FROM tmls ORDER BY id
    LOOP
        -- Jan 1, 2025 measurements
        INSERT INTO measurements (tml_record_id, measurement_date, thickness, temperature, corrosion_rate)
        VALUES (
            tml_record.id,
            '2025-01-01',
            8.0 + (random() * 4),  -- thickness between 8-12
            70 + (random() * 30),  -- temperature between 70-100
            5 + (random() * 55)    -- corrosion_rate between 5-60
        );
        
        -- Feb 1, 2025 measurements
        INSERT INTO measurements (tml_record_id, measurement_date, thickness, temperature, corrosion_rate)
        VALUES (
            tml_record.id,
            '2025-02-01',
            7.5 + (random() * 4),  -- thickness between 7.5-11.5
            75 + (random() * 25),  -- temperature between 75-100
            5 + (random() * 55)    -- corrosion_rate between 5-60
        );
        
        -- Mar 1, 2025 measurements
        INSERT INTO measurements (tml_record_id, measurement_date, thickness, temperature, corrosion_rate)
        VALUES (
            tml_record.id,
            '2025-03-01',
            7.0 + (random() * 4),  -- thickness between 7-11
            80 + (random() * 20),  -- temperature between 80-100
            5 + (random() * 55)    -- corrosion_rate between 5-60
        );
    END LOOP;
END $$;