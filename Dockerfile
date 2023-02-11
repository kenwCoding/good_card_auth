FROM node:16.3.0-alpine

WORKDIR /usr/src/app

COPY .babelrc .

COPY package*.json ./

COPY . .

RUN yarn

RUN yarn run build

EXPOSE 8081

CMD [ "node", "./src/server.js" ]