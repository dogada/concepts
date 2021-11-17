#! /bin/bash

export PROJECT_ID="$(basename $(pwd) | tr [A-Z] [a-z])"
export CONTAINER_ID=$(docker ps -q -f name="^${PROJECT_ID}_$1[._]1")

if [ "$CONTAINER_ID" = "" ] 
then
echo "Container $1 with prefix $PROJECT_ID isn't found. $CONTAINER_ID"
exit 1
fi

export TAIL_ARGS="${@:2}"
docker exec -it $CONTAINER_ID $TAIL_ARGS
