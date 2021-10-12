#! /bin/bash

cd "${0%/*}"
export PROJECT_ID="$(basename $(pwd) | tr [A-Z] [a-z])"
export CONTAINER_ID=$(docker ps -q -f name="^${PROJECT_ID}_db" | head -1)
export CONTAINER_NAME=$(docker inspect --format="{{.Name}}" ${CONTAINER_ID})
export BACKUP_FILE="$1"

if [[ ! -f "$BACKUP_FILE" ]]
then
echo "Valid backup file path is required."
exit
fi

echo "Restoring database in Docker container $CONTAINER_NAME ($CONTAINER_ID) from $BACKUP_FILE."
echo "Started at  $(date -u)"

docker cp $BACKUP_FILE $CONTAINER_ID:./db.dump
docker exec -u postgres $CONTAINER_ID sh -c "ls -l ./db.dump && pg_restore -d postgres --clean --create ./db.dump"
docker exec $CONTAINER_ID rm ./db.dump

echo "Finished at $(date -u)"


 