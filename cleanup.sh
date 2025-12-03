#!/bin/bash

echo "Removing stack..."
docker stack rm coding-challenges

echo "Waiting for services to shutdown..."
sleep 10

echo "Pruning unused containers and networks..."
docker container prune -f
docker network prune -f

echo "Removing orphaned containers (if any)..."
# This finds containers that are not part of the swarm service but might be lingering
docker ps -a --filter "name=coding-challenges_" -q | xargs -r docker rm -f

echo "Cleanup complete."
