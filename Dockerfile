FROM node:18-alpine

LABEL maintainer="Abdelrrahman Elhaddad"

WORKDIR /app
EXPOSE 3000

COPY scripts/install.sh ./scripts/install.sh
RUN apk update && apk add bash
RUN bash ./scripts/install.sh

COPY package*.json .
RUN npm install
RUN apk del make gcc g++ python3

COPY . .

CMD ["bash", "./scripts/start.sh"]
