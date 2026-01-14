<div align="center">
  <img src="assets/coding-animation.svg" width="120" height="120" />
  <h1>Coding Challenges</h1>
  <p>A full-stack distributed coding challenge platform with microservices architecture</p>
  
  <p>
    <a href="https://coding-challenges-five.vercel.app">
      <img src="https://img.shields.io/badge/demo-live-brightgreen?style=for-the-badge" alt="Live Demo" />
    </a>
    <img src="https://img.shields.io/badge/license-MIT-blue?style=for-the-badge" alt="License" />
    <img src="https://img.shields.io/badge/next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/fastapi-0.115-009688?style=for-the-badge&logo=fastapi" alt="FastAPI" />
    <img src="https://img.shields.io/badge/docker-swarm-2496ED?style=for-the-badge&logo=docker" alt="Docker Swarm" />
  </p>
</div>

---

## 📖 Overview

A scalable, microservices-based platform for running and evaluating coding challenges. Users can browse challenges, write code in an in-browser editor, submit solutions, and receive instant feedback through automated test execution.

**Key Highlights:**
- 🔐 Secure authentication with Keycloak (OAuth2/OIDC)
- 👥 Role-based access control (Student, Editor, Admin)
- 🖥️ Real-time code editor with syntax highlighting
- 🏃 Sandboxed code execution with resource limits
- 📊 Submission history with detailed results
- 🐳 Docker Swarm deployment ready
- 🌐 Demo mode for offline/frontend-only deployment

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (Next.js)                              │
│                           http://localhost:3000                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            API GATEWAY (FastAPI)                             │
│                           http://localhost:8080                              │
└─────────────────────────────────────────────────────────────────────────────┘
                    │                 │                 │
                    ▼                 ▼                 ▼
          ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
          │   USERS     │   │ CHALLENGES  │   │  KEYCLOAK   │
          │  SERVICE    │   │   SERVICE   │   │   (Auth)    │
          │  (FastAPI)  │   │  (FastAPI)  │   │             │
          └─────────────┘   └─────────────┘   └─────────────┘
                 │                 │                 │
                 ▼                 │                 │
          ┌─────────────┐         │                 │
          │ PostgreSQL  │◄────────┘                 │
          │  Database   │                           │
          └─────────────┘                           │
                                   │                │
                                   ▼                │
                          ┌─────────────┐           │
                          │  RabbitMQ   │           │
                          │   Broker    │           │
                          └─────────────┘           │
                                   │                │
                                   ▼                │
                          ┌─────────────┐           │
                          │  SANDBOX    │           │
                          │  RUNNER     │           │
                          │  (Worker)   │           │
                          └─────────────┘           │
```

### Services

| Service | Technology | Description |
|---------|------------|-------------|
| **Frontend** | Next.js 16, TypeScript, Tailwind CSS | User interface with Monaco code editor |
| **Gateway** | FastAPI | API routing and request forwarding |
| **Users Service** | FastAPI, SQLAlchemy | User profile management |
| **Challenges Service** | FastAPI, SQLAlchemy | Challenge CRUD and submissions |
| **Sandbox Runner** | Python, Pika | Isolated code execution worker |
| **Auth** | Keycloak | Identity and access management |
| **Database** | PostgreSQL | Persistent data storage |
| **Message Broker** | RabbitMQ | Async communication for code execution |

## ✨ Features

- **User Authentication** - OAuth2/OIDC with Keycloak
- **Role-Based Access Control** - Student, Editor, Admin roles
- **Challenge Management** - Browse, create, edit challenges
- **Code Editor** - Monaco editor with Python syntax highlighting
- **Code Execution** - Sandboxed execution with timeout/memory limits
- **Test Validation** - Automated test case checking
- **Submission History** - Track all submissions with verdicts
- **Responsive Design** - Works on desktop and mobile
- **Demo Mode** - Frontend works offline with mock data

## 🚀 Quick Start

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/install/)
- Docker Swarm initialized (`docker swarm init`)
- Node.js 18+ (for frontend development only)

### Deploy Locally

```bash
# Clone the repository
git clone https://github.com/aighita/coding-challenges.git
cd coding-challenges

# Deploy with Docker Swarm
./deploy.sh
```

The script will:
1. Build all Docker images
2. Initialize Docker Swarm (if needed)
3. Deploy the full stack
4. Seed the database with sample challenges

### Access Services

| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | - |
| Keycloak Admin | http://localhost:8081 | admin / admin |
| API Gateway | http://localhost:8080 | - |
| RabbitMQ Management | http://localhost:15672 | user / password |

### Cleanup

```bash
./cleanup.sh
```

## 🧪 Testing

### Frontend Tests (Jest)

```bash
cd frontend
npm test              # Run tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Backend Tests (Pytest)

```bash
# Run all backend tests
./run-tests.sh

# Or run individually
cd challenges && pytest
cd users && pytest
cd gateway && pytest
cd sandbox-runner && pytest
```

## 🌐 Demo Mode

The frontend can run standalone without backend services (e.g., on Vercel). When services are offline:

- Shows "Demo Mode" banner
- Displays sample challenges
- Allows demo login with mock users

**Demo Credentials:**

| Username | Password | Role | Access |
|----------|----------|------|--------|
| `student` | `demo` | Student | Challenges only |
| `editor` | `demo` | Editor | Challenges + Editor |
| `admin` | `demo` | Admin | Full access |

**Live Demo:** [https://coding-challenges-five.vercel.app](https://coding-challenges-five.vercel.app)

## 📁 Project Structure

```
.
├── frontend/           # Next.js frontend application
│   ├── app/            # App router pages
│   ├── components/     # React components
│   └── lib/            # Utilities and mock data
├── gateway/            # API Gateway (FastAPI)
├── challenges/         # Challenges Service (FastAPI)
├── users/              # Users Service (FastAPI)
├── sandbox-runner/     # Code execution worker
├── auth/               # Keycloak realm configuration
├── fixtures/           # Database seed scripts
├── deploy.sh           # Deployment script
├── cleanup.sh          # Teardown script
├── run-tests.sh        # Test runner script
└── docker-swarm-stack.yml
```

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16 (React 19)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Radix UI
- **Auth:** NextAuth.js
- **Editor:** Monaco Editor

### Backend
- **Framework:** FastAPI (Python)
- **ORM:** SQLAlchemy + AsyncPG
- **Messaging:** Pika / Aio-pika

### Infrastructure
- **Orchestration:** Docker Swarm
- **Database:** PostgreSQL
- **Message Broker:** RabbitMQ
- **Identity Provider:** Keycloak

## 🔧 Configuration

Key environment variables in `docker-swarm-stack.yml`:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `KEYCLOAK_ISSUER` | Keycloak realm URL |
| `RABBITMQ_URL` | RabbitMQ connection string |
| `NEXTAUTH_SECRET` | NextAuth.js secret key |

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Andrei-Iulian Ghita**

- GitHub: [@aighita](https://github.com/aighita)

---

<div align="center">
  <p>⭐ Star this repo if you find it useful!</p>
</div>
