FROM node:alpine

ENV NODE_ENV production
ENV NODE_PORT 8080

RUN mkdir -p /opt/yarn && \
    apk add --no-cache curl gnupg && \
    curl -o- -L https://yarnpkg.com/install.sh | sh && \
    apk del curl gnupg
ENV PATH $PATH:/opt/yarn/bin

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app

RUN yarn install

EXPOSE ${NODE_PORT}

CMD [ "npm", "start" ]
