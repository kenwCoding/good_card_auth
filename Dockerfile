FROM node:16.3.0-alpine

WORKDIR /usr/src/app

COPY .babelrc .

COPY package*.json ./

COPY yarn.lock .

RUN yarn

COPY src src

RUN yarn run build

ENV PORT=8081

EXPOSE 8081

ENV NODE_START_CMD=./dist/server.js

CMD [ "node", "./dist/index.js" ]