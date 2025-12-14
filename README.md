# Distributed Coding Challenges Platform

A scalable, microservices-based platform for running and evaluating coding challenges. This project leverages Docker Swarm for orchestration, Keycloak for authentication, and a modern frontend built with Next.js.

## 🏗 Architecture

The platform is composed of several microservices, each with a specific responsibility:

*   **Frontend**: A Next.js (React) application serving as the user interface.
*   **API Gateway**: The entry point for backend requests, routing them to the appropriate services.
*   **Auth Service**: Keycloak Identity and Access Management for secure user authentication.
*   **Users Service**: Manages user profiles and data.
*   **Challenges Service**: Manages coding challenges and their metadata.
*   **Sandbox Runner**: A distributed worker service that executes user-submitted code in a secure environment.
*   **Message Broker**: RabbitMQ for asynchronous communication between the Challenges service and Sandbox Runners.
*   **Database**: PostgreSQL for persistent storage.
*   **Cache**: Redis for caching and session management.

## 🚀 Tech Stack

### Frontend
*   **Framework**: [Next.js 16](https://nextjs.org/)
*   **Language**: TypeScript
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Radix UI](https://www.radix-ui.com/)
*   **Auth**: [NextAuth.js](https://next-auth.js.org/) (integrated with Keycloak)
*   **Editor**: Monaco Editor (VS Code editor component)

### Backend Services
*   **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
*   **Server**: Uvicorn
*   **ORM**: SQLAlchemy with AsyncPG
*   **Messaging**: Aio-pika / Pika

### Infrastructure & DevOps
*   **Orchestration**: Docker Swarm
*   **Containerization**: Docker
*   **Database**: PostgreSQL
*   **Message Broker**: RabbitMQ
*   **Identity Provider**: Keycloak

## 🛠 Prerequisites

Ensure you have the following installed on your machine:
*   [Docker](https://docs.docker.com/get-docker/)
*   [Docker Compose](https://docs.docker.com/compose/install/)

## 🏁 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd coding-challenges
```

### 2. Deploy with Docker Swarm

The project includes a convenience script to build images, initialize the swarm, and deploy the stack.

```bash
chmod +x deploy.sh
./deploy.sh
```

This script will:
1.  Build all Docker images for the services.
2.  Initialize Docker Swarm (if not already active).
3.  Deploy the stack defined in `docker-swarm-stack.yml`.
4.  Wait for services to stabilize.
5.  Seed the database with initial challenge data.

### 3. Access the Application

Once deployed, the services will be available at the following addresses:

*   **Frontend**: http://localhost:3000
*   **Keycloak (Auth)**: http://localhost:8081
*   **API Gateway**: http://localhost:8080
*   **RabbitMQ Management**: http://localhost:15672 (User: `user`, Pass: `password`)

## 🧹 Cleanup

To shut down the services and remove the stack:

```bash
chmod +x cleanup.sh
./cleanup.sh
```

## 🧩 Service Configuration

The system is configured via environment variables defined in `docker-swarm-stack.yml`. Key configurations include:

*   **Service URLs**: Communication between services is handled via internal Docker overlay networks (`service_net`, `db_net`, `broker_net`).
*   **Database**: All services connect to a shared or dedicated PostgreSQL instance.
*   **Keycloak**: Configured with a `realm.json` import file for initial setup.

## 📂 Project Structure

```
.
├── auth/               # Keycloak configuration and realm export
├── challenges/         # Challenges Service (FastAPI)
├── frontend/           # Next.js Frontend Application
├── gateway/            # API Gateway (FastAPI)
├── sandbox-runner/     # Code Execution Worker (Python Consumer)
├── users/              # Users Service (FastAPI)
├── deploy.sh           # Deployment script
├── cleanup.sh          # Teardown script
└── docker-swarm-stack.yml # Docker Swarm Stack definition
```
