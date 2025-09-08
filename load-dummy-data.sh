#!/bin/bash

echo "Waiting for database tables to be created by Spring Boot..."

# Wait for the backend to be healthy (which means tables are created)
while ! curl -s http://localhost:8081/actuator/health > /dev/null 2>&1; do
    echo "Waiting for backend to be ready..."
    sleep 5
done

echo "Backend is ready. Checking if tables exist..."

# Check if tables exist
TABLE_COUNT=$(docker exec tml-postgres psql -U postgres -d tml_corrosion -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('tmls', 'measurements', 'classifications');")

if [ "$TABLE_COUNT" -eq "3" ]; then
    echo "Tables found. Loading dummy data..."
    
    # Check if data already exists
    DATA_COUNT=$(docker exec tml-postgres psql -U postgres -d tml_corrosion -t -c "SELECT COUNT(*) FROM tmls;")
    
    if [ "$DATA_COUNT" -eq "0" ]; then
        cat insert_specific_dummy_data.sql | docker exec -i tml-postgres psql -U postgres -d tml_corrosion
        echo "Dummy data loaded successfully!"
    else
        echo "Data already exists in the database. Skipping data load."
    fi
else
    echo "Error: Tables not found. Make sure the backend application has started properly."
    exit 1
fi