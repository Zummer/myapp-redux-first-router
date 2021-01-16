FROM node:alpine

RUN apk add --no-cache curl

WORKDIR /app

COPY ./out/server /app/out/server
COPY ./out/buildServer /app/out/buildServer
COPY package.json /app

RUN npm install

EXPOSE 3000

CMD [ "npm","run", "prod-server" ]

HEALTHCHECK --interval=5s --timeout=3s --start-period=1s CMD curl --fail http://127.0.0.1:3000/api/health || exit 1