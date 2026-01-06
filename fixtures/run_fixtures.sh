#!/bin/bash
set -e

# Find the challenges container
CONTAINER_ID=$(docker ps -q -f name=coding-challenges_challenges | head -n 1)

if [ -z "$CONTAINER_ID" ]; then
    echo "Error: Challenges container not found."
    exit 1
fi

echo "Found challenges container: $CONTAINER_ID"

# Copy the seed script to the container
echo "Copying seed script..."
docker cp fixtures/seed_fixtures.py $CONTAINER_ID:/app/seed_fixtures.py

# Execute the script
echo "Running seed script..."
docker exec $CONTAINER_ID python seed_fixtures.py

echo "Done!"
