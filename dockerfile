FROM node:alpine

WORKDIR /app

COPY . .

RUN yarn

RUN npx tsc

CMD ["node", "./lib/app"] 