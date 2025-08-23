-- Table 1: List of TML IDs
CREATE TABLE tmls (
    id SERIAL PRIMARY KEY,
    circuit_id VARCHAR(50) NOT NULL,
    tml_id VARCHAR(50) NOT NULL,
    UNIQUE(circuit_id, tml_id)
);

-- Table 2: Measurements for TML IDs
CREATE TABLE measurements (
    id SERIAL PRIMARY KEY,
    tml_id INTEGER NOT NULL REFERENCES tmls(id),
    measurement_date DATE NOT NULL,
    thickness DECIMAL(10,2),
    temperature DECIMAL(10,2),
    corrosion_rate DECIMAL(10,2),
    UNIQUE(tml_id, measurement_date)
);

-- Table 3: Classification table (flexible for different types)
CREATE TABLE classifications (
    id SERIAL PRIMARY KEY,
    classification_type VARCHAR(50) NOT NULL, -- 'corrosion_rate' or 'temperature' etc
    range_label VARCHAR(50) NOT NULL,
    min_value DECIMAL(10,2),
    max_value DECIMAL(10,2),
    UNIQUE(classification_type, range_label)
);

-- Insert corrosion rate classifications
INSERT INTO classifications (classification_type, range_label, min_value, max_value) VALUES
('corrosion_rate', '< 10 mpy', 0, 10),
('corrosion_rate', '10-20 mpy', 10, 20),
('corrosion_rate', '20-30 mpy', 20, 30),
('corrosion_rate', '30-50 mpy', 30, 50),
('corrosion_rate', '> 50 mpy', 50, NULL);