# Freelance Student App

A beginner-friendly full-stack freelance project management application.

## Features
- Register and log in
- JWT authentication for protected pages and API requests
- Add, edit and delete clients
- Add, edit and delete projects
- Add, edit and delete tasks
- Dashboard with basic counts

## Technologies
- Frontend: React, JavaScript, React Router, Axios, Vite and Tailwind CSS
- Backend: Java, Spring Boot, Spring Security, Spring Data JPA
- Database: PostgreSQL
- Authentication: Basic JWT token + BCrypt password hashing

## Folder structure

```text
freelance-student/
├── frontend/
│   ├── src/
│   │   ├── components/       # Navbar and protected route
│   │   ├── pages/            # Login, register, dashboard, clients, projects, tasks
│   │   ├── api.js            # Axios and JWT header
│   │   ├── App.jsx           # Page routes
│   │   └── main.jsx          # React entry point
│   └── package.json
└── backend/
    ├── src/main/java/com/student/app/
    │   ├── controller/       # REST API methods
    │   ├── model/            # Database table classes
    │   ├── repo/             # Database operations
    │   ├── security/         # JWT helper, filter and security settings
    │   └── Main.java
    └── pom.xml
```

## 1. Create the PostgreSQL database

Open pgAdmin or the PostgreSQL terminal and run:

```sql
CREATE DATABASE freelance_student_db;
```

## 2. Configure the backend database

Open `backend/src/main/resources/application.properties` and change:

```properties
spring.datasource.username=postgres
spring.datasource.password=YOUR_POSTGRES_PASSWORD
```

Use the username and password configured on your computer.

## 3. Run the backend

You need Java 21 and Maven installed.

```bash
cd backend
mvn spring-boot:run
```

Backend runs at `http://localhost:8082`.

Hibernate creates the database tables automatically when the application starts.

## 4. Run the frontend

You need Node.js installed. Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5175` in your browser.

## How the simple JWT login works

1. The user enters their email and password in React.
2. React sends them to `POST /api/auth/login`.
3. Spring Boot finds the user and checks the password using BCrypt.
4. If the password is correct, the backend creates a JWT containing the user's email.
5. React stores the token in `localStorage`.
6. `api.js` adds `Authorization: Bearer <token>` to each API request.
7. `JwtFilter` reads the token and checks its signature and expiry.
8. If the token is valid, Spring Security allows the request to reach the protected controller.

The token expires after 24 hours. Passwords are stored as BCrypt hashes, not plain text.

## Main API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Login and receive a JWT |
| GET | `/api/dashboard/stats` | Get dashboard counts |
| GET/POST | `/api/clients` | List or add clients |
| PUT/DELETE | `/api/clients/{id}` | Edit or delete a client |
| GET/POST | `/api/projects` | List or add projects |
| PUT/DELETE | `/api/projects/{id}` | Edit or delete a project |
| GET/POST | `/api/tasks` | List or add tasks |
| PUT/DELETE | `/api/tasks/{id}` | Edit or delete a task |

## Notes
- Register a new account from the Register page before logging in.
- The Vite development server forwards `/api` requests to the Spring Boot backend.
- This is a student learning project. Before deploying it publicly, use environment variables for database credentials and the JWT secret, use HTTPS, and review access checks for every API endpoint.
