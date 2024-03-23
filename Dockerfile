FROM node:20 AS deps
WORKDIR /src
COPY package.json package-lock.json /src/
RUN npm ci

FROM node:20

WORKDIR /src

COPY --from=deps /src/node_modules ./node_modules
COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]

LABEL org.label-schema.vcs-url="https://github.com/cyverse-de/sonora"
