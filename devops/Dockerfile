FROM alpine:3.14

# all files required for deployment
WORKDIR /app
COPY devops/. .
COPY docker-compose.yml docker-compose.swarm.yml ./
RUN pwd && ls -l .

# https://stackoverflow.com/a/35770783
ENTRYPOINT [ "/bin/sh", "-c", "trap : TERM INT; sleep 1000d & wait"]
