# TML Corrosion Backend

Spring Boot backend service for TML Corrosion Angular application.

## Prerequisites

- Java 17+
- PostgreSQL 12+
- Maven 3.6+

## Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE tml_corrosion;
```

2. Update database credentials in `src/main/resources/application.properties`:
```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

## Running the Application

1. Build the project:
```bash
mvn clean install
```

2. Run the application:
```bash
mvn spring-boot:run
```

The backend will start on http://localhost:8080

## API Endpoints

### TML Points
- `GET /api/tml-points` - Get all TML points
- `GET /api/tml-points/{id}` - Get TML point by ID
- `GET /api/tml-points/number/{tmlNumber}` - Get TML point by number
- `GET /api/tml-points/equipment/{equipmentName}` - Get TML points by equipment
- `GET /api/tml-points/location/{location}` - Get TML points by location
- `POST /api/tml-points` - Create new TML point
- `PUT /api/tml-points/{id}` - Update TML point
- `DELETE /api/tml-points/{id}` - Delete TML point

### Measurements
- `GET /api/measurements` - Get all measurements
- `GET /api/measurements/{id}` - Get measurement by ID
- `GET /api/measurements/tml-point/{tmlPointId}` - Get measurements for TML point
- `GET /api/measurements/tml-point/{tmlPointId}/latest` - Get latest measurement
- `GET /api/measurements/date-range?start={date}&end={date}` - Get measurements by date range
- `POST /api/measurements` - Create new measurement
- `PUT /api/measurements/{id}` - Update measurement
- `DELETE /api/measurements/{id}` - Delete measurement

### Corrosion Data
- `GET /api/corrosion-data` - Get all corrosion data
- `GET /api/corrosion-data/{id}` - Get corrosion data by ID
- `GET /api/corrosion-data/category/{category}` - Get corrosion data by category
- `GET /api/corrosion-data/risk-level/{riskLevel}` - Get corrosion data by risk level
- `POST /api/corrosion-data` - Create new corrosion data
- `PUT /api/corrosion-data/{id}` - Update corrosion data
- `DELETE /api/corrosion-data/{id}` - Delete corrosion data

## Testing

Run tests with:
```bash
mvn test
```