#!/bin/bash
DATABASE_URL=$DOCKER_DATABASE_URL && DATABASE_HOST=$DOCKER_DATABASE_HOST && \
./scripts/wait-for-it.sh $DATABASE_HOST:$DATABASE_PORT -t 30 -- npm run migrate -- --name init && \
npm run dev:docker
