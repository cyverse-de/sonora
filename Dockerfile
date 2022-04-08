FROM node:16 AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /src
COPY package.json package-lock.json /src/
RUN npm ci

FROM node:16

WORKDIR /src

COPY --from=deps /src/node_modules ./node_modules
COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]

LABEL org.label-schema.vcs-url="https://github.com/cyverse-de/sonora"
