FROM node:23-alpine

ENV TARGET=/usr/local/src/ui

WORKDIR ${TARGET}

COPY ./package.json ${TARGET}/
COPY ./package-lock.json ${TARGET}/

RUN npm install

# COPY --from=config . ${TARGET}/config
COPY ./vite.config.js ${TARGET}/
COPY ./src/ ${TARGET}/src
COPY ./index.html ${TARGET}/
COPY ./public ${TARGET}/public
COPY --chmod=775 ./start.sh ${TARGET}/

RUN npm run build

CMD ./start.sh
