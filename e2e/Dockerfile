FROM mcr.microsoft.com/playwright:bionic

# https://github.com/codeceptjs/CodeceptJS/blob/3.x/Dockerfile
# Add our user and group first to make sure their IDs get assigned consistently,
# regardless of whatever dependencies get added.
RUN groupadd --system nightmare && useradd --system --create-home --gid nightmare nightmare
# Set HOST ENV variable for Selenium Server
ENV HOST=selenium

RUN apt-get update && \
      apt-get install -y libgtk2.0-0 libgconf-2-4 \
      libasound2 libxtst6 libxss1 libnss3 xvfb bash-completion

RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /home/pptruser

ENV APP_USER pwuser
#RUN usermod --append --groups audio,video $APP_USER
ENV NODE_ENV=production

RUN mkdir /app
WORKDIR /app
RUN chown -R $APP_USER:$APP_USER .

COPY --chown=$APP_USER:$APP_USER package.json package-lock*.json ./
RUN npm completion >> /etc/bash_completion.d/npm
USER $APP_USER
RUN npm ci && npm cache clean --force

COPY --chown=$APP_USER:$APP_USER . .

CMD ["npm", "run", "ui"]
