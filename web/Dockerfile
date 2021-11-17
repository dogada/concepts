FROM node:16.13-bullseye-slim as base
ENV NODE_ENV=production
EXPOSE 3000
EXPOSE 9229
LABEL maintainer="entropyhacker@gmail.com"
ADD https://github.com/krallin/tini/releases/download/v0.19.0/tini /tini
RUN chmod +x /tini

# TODO: remove git
# RUN apt autoremove -y && apt-get clean
RUN mkdir /app && chown -R node:node /app
WORKDIR /app
USER node
COPY --chown=node:node package.json package-lock*.json ./
# FIX: make completion system-wide
RUN npm completion >> ~/.bashrc && mkdir .next
ENV PATH=/app/node_modules/.bin:$PATH

FROM base as dev
ENV NODE_ENV=development
# install git if some npm packages need it
#RUN apt-get update && apt-get install -y git time
USER node
RUN ((ls -l package-lock.json && npm ci) || npm i) && npm cache clean --force
CMD ["npm", "run", "dev"]

FROM dev as build
ENV NODE_ENV=production
COPY --chown=node:node . .
USER node
RUN npm run build && rm -rf /app/.next/cache

FROM build as test
RUN npm test
CMD ["npm", "test"]

#FROM test as audit
#RUN npm audit --audit-level critical

FROM base as prod
ENV NODE_ENV=production
RUN npm i --production && npm cache clean --force
COPY --from=build /app/.next /app/.next
COPY --from=build /app/public /app/public
COPY --from=build /app/healthcheck.js /app/

#USER root
RUN du -h --max-depth=1 .

USER node
HEALTHCHECK --interval=10s CMD node healthcheck.js
ENTRYPOINT ["/tini", "--"]
CMD ["next", "start"]
