FROM node:12-alpine

WORKDIR /src

COPY package.json package-lock.json /src/
COPY start.sh /usr/local/bin/
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["start.sh"]

LABEL org.label-schema.vcs-url="https://github.com/cyverse-de/sonora"
