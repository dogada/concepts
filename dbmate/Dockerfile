FROM amacneil/dbmate:1.12.1

WORKDIR /app
COPY migrations ./db/migrations
RUN ls ./db/migrations

# https://stackoverflow.com/a/35770783
ENTRYPOINT [ "/bin/sh", "-c", "trap : TERM INT; sleep 1000d & wait"]
