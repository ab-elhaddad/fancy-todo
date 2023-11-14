apk update && \
    apk add --no-cache make gcc g++ python3 && \
    npm i -g npm && \
    npm cache clean --force && \
    npm install -g node-gyp
