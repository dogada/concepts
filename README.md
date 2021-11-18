# ConcepTS — web project template (Docker, Next.js, React, TypeScript, Postgres, Redis)

This web project template can be used to create skeleton of typical web-project that can
be run locally, inside Docker Swarm or Kubernetes. You can start own project by forking
this repo, then add it to git as upstream:
`git remote add upstream git@github.com:dogada/concepts.git`

Then you can merge updates on demand with `git pull upstream main`.

The project is in the experimental stage, so use it with care. It's planned to extract
common react utils to `@dogada/react-utils` to simplify reusability.

## Dev and Prod environment

As first step you need to rename `env-sample` file to `.env` and fill in your environment
variables. Root `.env` is excluded from version control in `.gitignore`. Inside `web`
folder you can find `.env.development` and `.env.production` files that should contain
only public environment variables like Google Analytics ID, etc.

The project can be run in development mode `npm run dev` and in production mode. This 2 versions can be run in parallel on same machine, each version uses own
volumes and hence own database. When you built project with `npm run build` 2 images are
created: 'dev' with various development utilities and 'prod' image, that contains only
production code.

Development version is available at `http://localhost:3001`. Production version is served
by a Traefik proxy, running in swarm cluster, and available at `WEBSITE_URL` from production `.env`.

At the same time several versions of the project can be run on same machine. You can use
`./devops/docker-exec.sh` script to access environment for current folder. For example
`./devops/docker-exec.sh web ls` will run `ls` in web container that was started from
current folder. Above command will take current directory as project name and will work with both
containers created with `docker-compose` and with `docker stack deploy`.

It's also useful to create alias for docker-exec.sh: `alias de=./devops/docker-exec.sh`.
Then `de`may be called from the directory containing `.env`.

## Database initialization

```
$ de db psql -U postgres -c "CREATE DATABASE app; CREATE USER app WITH ENCRYPTED PASSWORD '$APP_DB_PASSWORD'; GRANT ALL PRIVILEGES ON DATABASE app TO app;"
```

## Database migrations

To apply all migrations use `de dbmate dbmate up`.
To discard most recent migration `de dbmate dbmate down`.
To replay last migration and regenerate zapatos schema use `npm run migrate:replay` (please do this only with migrations that were not pushed yet).

If you need to regenerate `web/src/zapatos/schema.ts` only, use `npm run dev:cmd zapatos`.

To open a db shell inside a Docker Swarm container, you can do:

```
de db psql -U postgres app
```

To create new migration use `de dbmate dbmate new $MIGRATION_NAME`.

## Backup and restore database

In the root of project there is a file `backup.sh` that backups pg database app of project
with same name as parent directory into `/backup` folder.

To restore a database from backup, first stop web app `docker-compose stop web` or `docker service rm $PROJECT_dev_web` to unlock db and then use `./devops/restore_db.sh` script, for example:

```
$ docker-compose stop web && ./devops/restore_db.sh /backup/$PROJECT_dev-db.dump && docker-compose up -d
```

# Schedule daily backups

Run from the environment directory you may want to process:

```
sudo ~/devops/create-backup-service-and-timer.sh
```

It will schedule `./devops/backup.sh` to daily runs.

## VSCode setup

You can find project's workspace in `./project.code-workspace`, open it in your VScode to use common settings or copy them to your own workspace.

## Working with production environment locally

To deploy production version locally you will need to configure Docker Swarm as described
in `docs/SERVER.md`, then `npm run build`. You may have several versions of the project
that run on same host and available on different domains. Developers can use own
workstations to demo latest changes for QA/UAT without prior deployment to the cloud. Such
demo deployments are usually available inside company's VPN network only and can be
accessed using urls like `https://$PROJECT.$DEVELOPER.company.vpn`.

When you build new production `$PROJECT/web:latest` image locally, you can force swarm to use it with:

```
docker service update --force $PROJECT_dev_web
```

## Working with NPM packages

To update npm packages in web container use: `de web npm-check -u`

## E2E testing using CodeceptJS

E2E tests are written in Typescript and located in `./e2e/tests`. To run them use `npm run test:e2e` command that will test `http://web:3000` in the current Dev environment. To see
E2E test UI start `docker-compose up -d e2e` and open `http://localhost:3333`, here you
can repeat tests and see screenshots from actual browsers.

By default E2E tests are run against 'http://web:3000' that is url of development
web container inside docker network, but you can run tests against an external version,
for example to test prod version deployed locally with `npm run prod`, run:

```
$ E2E_TEST_URL=https://$PROJECT.company.vpn npm run test:e2e
```

or

```
$ E2E_TEST_URL=https://$PROJECT.company.vpn docker-compose up -d e2e
```
