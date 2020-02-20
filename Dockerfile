FROM node:12-alpine

COPY . /src
WORKDIR /src

RUN npm install
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]

ARG git_commit=unknown
ARG version=unknown
ARG descriptive_version=unknown

LABEL org.cyverse.git-ref="$git_commit"
LABEL org.cyverse.version="$version"
LABEL org.cyverse.descriptive-version="$descriptive_version"
LABEL org.label-schema.vcs-ref="$git_commit"
LABEL org.label-schema.vcs-url="https://github.com/cyverse-de/sonora"
LABEL org.label-schema.version="$descriptive_version"
