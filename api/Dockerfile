FROM node:23-alpine

ENV TARGET=/usr/local/src/api

WORKDIR ${TARGET}

COPY ./package.json ${TARGET}/
COPY ./package-lock.json ${TARGET}/

RUN npm install

# COPY --from=config . ${TARGET}/config
COPY ./src/ ${TARGET}/src
COPY --chmod=775 ./start.sh ${TARGET}/

CMD ./start.sh
