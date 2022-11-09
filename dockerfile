FROM node:alpine

COPY . /app

WORKDIR /app

CMD [ "node", "/lib/app.js" ]