#! /bin/bash

export PROJECT_ID="$(basename $(pwd) | tr [A-Z] [a-z])"
export SERVICE=${PROJECT_ID}_dbmate
echo "Apply db migrations... Press Ctrl-C to cancel."
sleep 5
# update dbmate from deploying tag
docker service update $SERVICE
docker service scale $SERVICE=1

./devops/docker-exec.sh dbmate dbmate up

docker service scale $SERVICE=0
sleep 5 && docker stack ps $PROJECT_ID
