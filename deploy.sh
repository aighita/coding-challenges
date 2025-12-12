#!/bin/bash

# Exit on error
set -e

echo "Building Docker images..."
docker compose -f docker-swarm-stack.yml build

echo "Initializing Docker Swarm (if not already)..."
docker swarm init || true

echo "Deploying Stack..."
docker stack deploy -c docker-swarm-stack.yml coding-challenges

echo "Deployment complete! Services are starting up."
echo "Check status with: docker stack services coding-challenges"

echo "Waiting for challenges service to match desired state..."
# Wait for the service to be ready (simplified check)
sleep 40

echo "Seeding database..."
# Get the container ID of the running challenges service
# We filter by name and take the first one
CONTAINER_ID=$(docker ps -q -f name=coding-challenges_challenges | head -n 1)

if [ -n "$CONTAINER_ID" ]; then
    echo "Found challenges container: $CONTAINER_ID"
    docker exec $CONTAINER_ID python seed.py
    echo "Database seeded successfully."
else
    echo "Error: Could not find challenges container to seed database."
    echo "Please run 'docker ps' to check if services are running."
fi
