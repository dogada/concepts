#! /bin/bash

export PROJECT_ID="$(basename $(pwd) | tr [A-Z] [a-z])"
./db_migrate.sh
echo "Updating services..."
dotenv docker stack deploy --with-registry-auth -c docker-compose.yml $PROJECT_ID
sleep 5 && docker stack services $PROJECT_ID
