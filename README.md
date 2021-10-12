# ConcepTS -- Concept Web Framework based on TypeScript, Postgres, Redis

## Dev and Prod environment

The project can be run in development mode `npm run dev` and in production mode `npm run prod`. This 2 versions can be run in parallel on same machine, each version uses own volumes and hence own database. When you built project with `npm run build` 2 images are created: 'dev' with various development utilities and 'prod' image, that contains only production code.

At the same time several versions of the project can be run on same machine. You can use
`./docker-exec.sh` script to access environment for current folder. For example
`./docker-exec.sh web ls` will run `ls` in web container that was started from current
folder (with help of docker-compose or docker stack).

## Database initialization

```
$ ./docker-exec.sh db psql -U postgres

postgres=# CREATE DATABASE app;
postgres=# CREATE USER app WITH ENCRYPTED PASSWORD 'APP_DB_PASSWORD FROM .env FILE!';
postgres=# GRANT ALL PRIVILEGES ON DATABASE app TO app;
postgres=# exit
```

TODO: use Salt or Ansible for initialization.

## Database migrations

To apply all migrations use `npm run migrate up`.
To discard most recent migration `npm run migrate down`.
To replay last migration and regenerate zapatos schema use `npm run migrate:replay` (please do this only with migrations that were not pushed yet).

If you need to regenerate `web/src/db/zapatos` typings only, use `npm run dev:cmd zapatos`.

For production environment execute commands in a web container of required environment.
For example for concepts_dev use:

```
$ ./docker-exec.sh dbmate up
```

Above command will take current directory as project name and will work with both
containers created by docker-compose and by Swarm. For example to open a db shell inside a
Swarm container, you can do:

```
./docker-exec.sh db psql -U postgres app
```

To create new migration use `nom run migrate new $MIGRATION_NAME`.

## Backup and restore database

In the root of project there is a file `backup.sh` that backups pg database app of project
with same name as parent directory into `/backup` folder.

To restore a database from backup, first stop web app `docker-compose stop web` or `docker service rm concepts_dev_web` to unlock db and then use `restore_db.sh` script, for example:

```
$ docker-compose stop web && ./restore_db.sh /backup/concepts_dev-db.dump && docker-compose up -d
```

# Schedule daily backups

Run from the environment directory you may want to process:

```
sudo ~/scripts/create-backup-service-and-timer.sh
```

It will schedule `./backup.sh` to daily runs.

The script itself can be obtained from 'Tools/' repository.

## VSCode setup

You can find project's workspace in `.vscode/concepts.code-workspace`, open it in your VScode to use common settings or copy them to your own workspace.

## Working with production environment locally

To deploy production version locally you will need to configure Docker Swarm as described in
`docs/SERVER.md`, then `npm run build` and then `npm run prod:deploy` that will deploy just
built images into swarm using settings from `.env` file in project directory. You can also
deploy project using settings from `~/Tools/localhost/stacks/concepts`. You may have
several versions of the project that run on same host and available on different domains.
Developers versions usually can be accessed inside company's VPN network using urls like
`https://project.username.company.com`.

You will also need to place `Tools/scripts/dotenv` to `/usr/local/bin/dotenv` that loads
`.env` and makes it available for next commands.

When you build new production `concepts_web:latest` image locally, you can force swarm to use it with:

```
docker service update --force concepts_dev_web
```

TODO: add instructions for starting production images without Swarm.

## Working with NPM packages

To update npm packages in web container use: `npm run dev:cmd -- npx npm-check -u`

## E2E testing using CodeceptJS

E2E tests are written in Typescript and located in `./e2e/tests`. To run them use `npm run test:e2e` command that will test `http://web:3000` in the current Dev environment. To see
E2E test UI start `docker-compose up -d e2e` and open `http://localhost:3333`, here you
can repeat tests and see screenshots from actual browsers.

By default E2E tests are run against 'http://web:3000' that is url of development
web container inside docker network, but you can run tests against an external version,
for example to test prod version deployed locally with `npm run prod`, run:

```
$ E2E_TEST_URL=https://concepts.$myproject.org npm run test:e2e
```

or

```
$ E2E_TEST_URL=https://concepts.$myproject.org docker-compose up -d e2e
```
