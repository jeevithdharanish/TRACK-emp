# Employee Performance Tracker — Backend

A RESTful API built with **Spring Boot 3.5** and **Java 21** for managing employee performance evaluations, roles, skill levels, and generating performance reports.

---

## Tech Stack

| Layer          | Technology                        |
|----------------|-----------------------------------|
| Language       | Java 21                           |
| Framework      | Spring Boot 3.5.0                 |
| Security       | Spring Security + JWT (jjwt 0.13) |
| Database       | MySQL                             |
| ORM            | Spring Data JPA / Hibernate       |
| Validation     | Spring Boot Starter Validation    |
| Build Tool     | Maven                             |
| Testing        | JUnit 5, Mockito, AssertJ, H2     |

---

## Project Structure

```
Backend/
├── src/main/java/com/dpx/tracker/
│   ├── config/             # Security, JWT, and app configuration
│   ├── constants/          # Endpoint paths, error codes & messages
│   ├── controller/         # REST controllers
│   ├── dto/                # Request/Response DTOs
│   ├── entity/             # JPA entities
│   ├── enums/              # Enumerations (Gender, Industry, etc.)
│   ├── exception/          # Custom exceptions & global handler
│   ├── mapper/             # Entity ↔ DTO mappers
│   ├── repository/         # Spring Data JPA repositories
│   ├── security/           # UserPrincipal
│   ├── service/            # Service interfaces
│   │   └── impl/           # Service implementations
│   └── util/               # Utility classes
├── src/main/resources/
│   └── application.properties
├── src/test/               # Unit & integration tests
└── pom.xml
```

---

## Prerequisites

- **Java 21** (JDK)
- **Maven 3.8+**
- **MySQL 8+**

---

## Database Setup

1. Create a MySQL database:
   ```sql
   CREATE DATABASE mydb;
   ```
2. The default connection is configured in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/mydb
   spring.datasource.username=root
   spring.datasource.password=root
   ```
   Update the credentials to match your local MySQL setup.

---

## Running the Application

```bash
# Clone the repository
git clone https://github.com/jeevithdharanish/TRACK-emp.git
cd TRACK-emp/Backend

# Build the project
./mvnw clean install

# Run the application
./mvnw spring-boot:run
```

The server starts on **http://localhost:8080**.

---

## API Endpoints

### Authentication
| Method | Endpoint              | Description       |
|--------|-----------------------|-------------------|
| POST   | `/api/v1/auth/login`  | User login        |
| POST   | `/api/v1/auth/register` | User registration |

### Employees
| Method | Endpoint                  | Description              |
|--------|---------------------------|--------------------------|
| GET    | `/api/v1/employees`       | List employees (paged)   |
| GET    | `/api/v1/employees/{id}`  | Get employee by ID       |
| POST   | `/api/v1/employees`       | Create employee          |
| PUT    | `/api/v1/employees/{id}`  | Update employee          |
| DELETE | `/api/v1/employees/{id}`  | Delete employee          |

### Performance Evaluations
| Method | Endpoint                              | Description                  |
|--------|---------------------------------------|------------------------------|
| GET    | `/api/v1/performance-evaluations`     | List evaluations (filtered)  |
| GET    | `/api/v1/performance-evaluations/{id}`| Get evaluation by ID         |
| POST   | `/api/v1/performance-evaluations`     | Create evaluation            |
| PUT    | `/api/v1/performance-evaluations/{id}`| Update evaluation            |
| DELETE | `/api/v1/performance-evaluations/{id}`| Delete evaluation            |

### Roles
| Method | Endpoint              | Description      |
|--------|-----------------------|------------------|
| GET    | `/api/v1/roles`       | List all roles   |
| GET    | `/api/v1/roles/{id}`  | Get role by ID   |
| POST   | `/api/v1/roles`       | Create role      |
| PUT    | `/api/v1/roles/{id}`  | Update role      |
| DELETE | `/api/v1/roles/{id}`  | Delete role      |

### Skill Level Stages
| Method | Endpoint                        | Description             |
|--------|---------------------------------|-------------------------|
| GET    | `/api/v1/skill-level-stage`     | List all stages         |
| GET    | `/api/v1/skill-level-stage/{id}`| Get stage by ID         |
| POST   | `/api/v1/skill-level-stage`     | Create stage            |
| PUT    | `/api/v1/skill-level-stage/{id}`| Update stage            |
| DELETE | `/api/v1/skill-level-stage/{id}`| Delete stage            |

### Reports
| Method | Endpoint                                    | Description              |
|--------|---------------------------------------------|--------------------------|
| GET    | `/api/v1/reports/performance/top`           | Top performers           |
| GET    | `/api/v1/reports/performance/departments`   | Department performance   |
| GET    | `/api/v1/reports/performance/trends`        | Performance trends       |

---

## Security

- JWT-based authentication
- All endpoints (except `/auth/**`) require a valid Bearer token
- Include the token in the `Authorization` header:
  ```
  Authorization: Bearer <your_jwt_token>
  ```

---

## Running Tests

```bash
./mvnw test
```

Tests use an **H2 in-memory database** so no MySQL setup is required for testing.

---

## Environment Variables (Optional)

You can override default settings via environment variables or a custom `application.properties`:

| Property                      | Default                                | Description         |
|-------------------------------|----------------------------------------|---------------------|
| `spring.datasource.url`      | `jdbc:mysql://localhost:3306/mydb`      | Database URL        |
| `spring.datasource.username` | `root`                                 | Database username   |
| `spring.datasource.password` | `root`                                 | Database password   |
| `jwt.secret`                 | *(base64-encoded key)*                 | JWT signing key     |
| `jwt.expiration`             | `3600000` (1 hour)                     | Token expiry (ms)   |
