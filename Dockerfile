FROM node:13-alpine

WORKDIR /src

COPY package.json package-lock.json /src/
RUN npm ci

COPY . .
RUN npm run build

COPY start.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/start.sh

EXPOSE 3000

CMD ["start.sh"]

LABEL org.label-schema.vcs-url="https://github.com/cyverse-de/sonora"
