#! /bin/sh

cd "${0%/*}"
export PROJECT_ID="$(basename $(pwd) | tr [A-Z] [a-z])"
echo $PROJECT_ID
export CONTAINER_ID=$(docker ps -q -f name="^${PROJECT_ID}_db" | head -1)
export CONTAINER_NAME=$(docker inspect --format="{{.Name}}" ${CONTAINER_ID})
export BACKUP_FILE=/backup/$PROJECT_ID-db-$(date -u  +"%Y%m%d_%H%M%S").dump

echo "Backuping Docker container $CONTAINER_NAME ($CONTAINER_ID) of project $PROJECT_ID into $BACKUP_FILE."
echo "Started at  $(date -u)"

docker exec -u postgres $CONTAINER_NAME /bin/sh \
 -c "pg_dump -Fc app" > $BACKUP_FILE

echo "Finished at $(date -u)"
ls -lh $BACKUP_FILE


 