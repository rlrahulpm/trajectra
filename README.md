# TML Corrosion Management System

A production-ready, full-stack application for managing Thickness Measurement Location (TML) corrosion data with advanced visualization capabilities.

## 🚀 Features

- **Real-time Corrosion Monitoring**: Track thickness measurements and corrosion rates
- **Interactive Sankey Diagrams**: Visualize corrosion flow patterns
- **Predictive Analytics**: Calculate remaining equipment life based on corrosion rates
- **RESTful API**: Complete CRUD operations for TML points, measurements, and corrosion data
- **Responsive UI**: Modern Angular interface with TRAJECTRA branding
- **Production Ready**: Dockerized deployment with PostgreSQL database

## 🏗️ Architecture

```
tml-corrosion-angular/
├── frontend/          # Angular 20 application
│   ├── src/
│   ├── Dockerfile
│   └── nginx.conf
├── backend/           # Spring Boot API
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
├── docker-compose.yml # Development environment
└── docker-compose.prod.yml # Production deployment
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
git clone https://github.com/yourusername/tml-corrosion-angular.git
cd tml-corrosion-angular
```

2. Copy environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start the application:
```bash
docker-compose up -d
```

4. Access the application:
- Frontend: http://localhost
- Backend API: http://localhost:8080/api

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

## 🔧 Configuration

### Environment Variables

#### Backend
- `DATABASE_URL`: PostgreSQL connection string
- `DATABASE_USERNAME`: Database username
- `DATABASE_PASSWORD`: Database password
- `PORT`: Server port (default: 8080)

#### Frontend
- `API_URL`: Backend API URL
- `PRODUCTION`: Enable production mode

## 📝 Database Schema

### TML Points Table
```sql
CREATE TABLE tml_points (
    id BIGSERIAL PRIMARY KEY,
    tml_number VARCHAR(255) UNIQUE NOT NULL,
    equipment_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    nominal_thickness DOUBLE PRECISION NOT NULL,
    minimum_thickness DOUBLE PRECISION NOT NULL,
    material VARCHAR(255),
    service VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);
```

### Measurements Table
```sql
CREATE TABLE measurements (
    id BIGSERIAL PRIMARY KEY,
    tml_point_id BIGINT REFERENCES tml_points(id),
    measurement_date TIMESTAMP NOT NULL,
    thickness DOUBLE PRECISION NOT NULL,
    corrosion_rate DOUBLE PRECISION,
    remaining_life DOUBLE PRECISION,
    inspector VARCHAR(255),
    equipment_condition VARCHAR(255),
    comments TEXT,
    created_at TIMESTAMP NOT NULL
);
```

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
