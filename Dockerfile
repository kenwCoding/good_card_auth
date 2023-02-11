FROM node:16.3.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

RUN yarn

EXPOSE 8081

CMD [ "node", "server.js" ]