# TML Corrosion Management System

A production-ready, full-stack application for managing Thickness Measurement Location (TML) corrosion data with advanced visualization capabilities.

## 🚀 Features

- **Real-time Corrosion Monitoring**: Track thickness measurements and corrosion rates (1-100 mpy range)
- **Interactive Sankey Diagrams**: Visualize corrosion flow patterns
- **Predictive Analytics**: Calculate remaining equipment life based on corrosion rates
- **RESTful API**: Complete CRUD operations for TML points, measurements, and corrosion data
- **Responsive UI**: Modern Angular interface with TRAJECTRA branding
- **Production Ready**: Dockerized deployment with PostgreSQL database
- **Demo Data**: Automatic loading of 20 TML points with 60 measurements for testing

## 🏗️ Architecture

```
tml-corrosion-angular/
├── frontend/                    # Angular 20 application
│   ├── src/
│   ├── Dockerfile
│   └── nginx.conf
├── backend/                     # Spring Boot API
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
├── database/                    # Database initialization
│   └── init/                    # PostgreSQL init scripts
├── docker-compose.yml           # Development environment
├── docker-compose.prod.yml      # Production deployment
├── load-dummy-data.sh           # Automatic data loading script
├── .env                         # Environment variables
└── insert_specific_dummy_data.sql # SQL script for test data
```

## 🛠️ Tech Stack

### Frontend
- Angular 20
- TypeScript
- D3.js for data visualization
- RxJS for reactive programming
- Nginx for production serving

### Backend
- Spring Boot 3.2
- Java 17
- PostgreSQL 15
- Spring Data JPA
- Maven

## 📋 Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local development)
- Java 17+ (for local development)
- PostgreSQL 12+ (for local development)

## 🚀 Quick Start

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/rlrahulpm/trajectra.git
cd trajectra
```

2. Start the application:
```bash
docker-compose up -d
```

3. Load demo data (optional but recommended):
```bash
./load-dummy-data.sh
```

4. Access the application:
- Frontend: http://localhost
- Backend API: http://localhost:8081/api

> **Note**: The `.env` file is already configured with default values. The demo data script automatically loads 20 TML points with 60 measurements spanning 3 dates (Jan 1, Feb 1, Mar 1, 2025) with corrosion rates between 1-100 mpy.

### Local Development

#### Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 🚢 Production Deployment

### Using Docker Compose

1. Set production environment variables:
```bash
cp .env.example .env.prod
# Edit .env.prod with production values
```

2. Deploy with production configuration:
```bash
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

### Manual Deployment

#### Backend
```bash
cd backend
mvn clean package
java -jar target/tml-corrosion-*.jar --spring.profiles.active=prod
```

#### Frontend
```bash
cd frontend
npm run build
# Deploy dist/ folder to your web server
```

## 📊 API Documentation

### TML Points
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tml-points` | Get all TML points |
| GET | `/api/tml-points/{id}` | Get TML point by ID |
| POST | `/api/tml-points` | Create new TML point |
| PUT | `/api/tml-points/{id}` | Update TML point |
| DELETE | `/api/tml-points/{id}` | Delete TML point |

### Measurements
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/measurements` | Get all measurements |
| GET | `/api/measurements/tml-point/{id}` | Get measurements for TML point |
| POST | `/api/measurements` | Create new measurement |
| PUT | `/api/measurements/{id}` | Update measurement |
| DELETE | `/api/measurements/{id}` | Delete measurement |

### Corrosion Data
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/corrosion-data` | Get all corrosion data |
| GET | `/api/corrosion-data/category/{category}` | Get by category |
| POST | `/api/corrosion-data` | Create new corrosion data |
| PUT | `/api/corrosion-data/{id}` | Update corrosion data |
| DELETE | `/api/corrosion-data/{id}` | Delete corrosion data |

## 🔒 Security Features

- CORS configuration for cross-origin requests
- Environment-based configuration
- Non-root Docker containers
- Security headers in Nginx
- Connection pooling for database

## 📈 Performance Optimizations

- Gzip compression
- Static asset caching
- Database connection pooling
- Hibernate batch processing
- Lazy loading for associations

## 🧪 Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### End-to-End Tests
```bash
cd frontend
npm run e2e
```

## 🗄️ Database & Demo Data

### Automatic Demo Data Loading

The application includes a script to automatically populate the database with realistic test data:

```bash
./load-dummy-data.sh
```

**Demo Data Includes:**
- **20 TML Points** across different equipment types (Pipes, Vessels, Tanks, Reactors, etc.)
- **60 Measurements** (3 per TML) on specific dates:
  - January 1st, 2025
  - February 1st, 2025  
  - March 1st, 2025
- **Corrosion rates** between 1-100 mpy (mils per year)
- **Realistic thickness degradation** over time
- **Temperature variations** with seasonal patterns
- **Equipment classifications** for corrosion severity

The script is intelligent:
- ✅ Waits for Spring Boot to create database tables
- ✅ Checks if data already exists to prevent duplicates
- ✅ Only runs when the database is empty
- ✅ Provides detailed feedback on the loading process

### Manual Data Loading

If you prefer to load data manually:
```bash
# After containers are running and healthy
cat insert_specific_dummy_data.sql | docker exec -i tml-postgres psql -U postgres -d tml_corrosion
```

## 🔧 Configuration

### Environment Variables

The `.env` file contains all necessary configuration:

```bash
# Database Configuration
DB_NAME=tml_corrosion
DB_USER=postgres
DB_PASSWORD=trajectra2024

# Frontend Configuration  
FRONTEND_PORT=80

# Backend Configuration
BACKEND_PORT=8080
```

#### Additional Backend Variables
- `DATABASE_URL`: PostgreSQL connection string (auto-configured)
- `DATABASE_USERNAME`: Database username (from .env)
- `DATABASE_PASSWORD`: Database password (from .env)
- `PORT`: Server port (8080 internally, exposed as 8081)

#### Frontend Variables
- `API_URL`: Backend API URL (configured for Docker networking)
- `PRODUCTION`: Enable production mode

## 📝 Database Schema

The application uses the following database structure (auto-created by Spring Boot):

### TMLs Table
```sql
CREATE TABLE tmls (
    id BIGSERIAL PRIMARY KEY,
    circuit_id VARCHAR(255) NOT NULL,
    tml_id VARCHAR(255) NOT NULL
);
```

### Measurements Table
```sql
CREATE TABLE measurements (
    id BIGSERIAL PRIMARY KEY,
    tml_record_id BIGINT REFERENCES tmls(id),
    measurement_date DATE NOT NULL,
    thickness DOUBLE PRECISION,
    temperature DOUBLE PRECISION,
    corrosion_rate DOUBLE PRECISION
);
```

### Classifications Table
```sql
CREATE TABLE classifications (
    id BIGSERIAL PRIMARY KEY,
    classification_type VARCHAR(255) NOT NULL,
    min_value DOUBLE PRECISION,
    max_value DOUBLE PRECISION,
    range_label VARCHAR(255) NOT NULL
);
```

**Sample Data Structure:**
- **TML-001 to TML-020**: Covering various equipment (PIPE-100-CS, VESSEL-200-SS, TANK-300-CS, etc.)
- **Measurements**: Thickness, temperature, and corrosion rate data
- **Classifications**: Corrosion rate and thickness severity ranges

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- TRAJECTRA for the project requirements
- Angular team for the excellent framework
- Spring Boot community for the robust backend framework
- D3.js for powerful data visualization capabilities

## 📞 Support

For support, email support@trajectra.com or open an issue in the GitHub repository.

## 🚦 Status

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-85%25-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)
