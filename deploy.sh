#! /bin/bash

cd "${0%/*}"
export PROJECT_ID="$(basename $(pwd) | tr [A-Z] [a-z])"

# pull latest images
docker-compose pull
docker image ls | head -10
# TODO: apply migfration from new image first
dotenv docker stack deploy --with-registry-auth -c docker-compose.yml $PROJECT_ID

sleep 5 && docker stack ps $PROJECT_ID

echo "Apply db migrations... Press Ctrl-C to cancel."
sleep 5

./docker-exec.sh web npm run migrate:up
