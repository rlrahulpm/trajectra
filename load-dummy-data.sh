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
        echo "Loading 100 TMLs across 15 circuits with trending patterns..."
        echo "- TMLs 001-040: Increasing corrosion/temperature trends"
        echo "- TMLs 041-080: Decreasing corrosion/temperature trends"
        echo "- TMLs 081-100: Stable trends with minor variations"
        
        cat insert_specific_dummy_data.sql | docker exec -i tml-postgres psql -U postgres -d tml_corrosion
        echo ""
        echo "✅ Dummy data loaded successfully!"
        echo "📊 Generated 100 TMLs with 300 measurements (3 dates each)"
        echo "🏭 Distributed across 15 different circuits"
        echo "📈 40% increasing trends, 40% decreasing trends, 20% stable"
    else
        echo "Data already exists in the database (found $DATA_COUNT TMLs)."
        echo "To reload data, first clear the database or restart with fresh Docker volumes."
    fi
else
    echo "Error: Tables not found. Make sure the backend application has started properly."
    echo "Expected 3 tables (tmls, measurements, classifications), found $TABLE_COUNT"
    exit 1
fi