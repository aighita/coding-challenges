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
