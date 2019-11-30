##########################################
# Dockerfile for Datalake IHM intra (prod)
##########################################

##########################################
# Dockerfile for Quasar generator
##########################################

# Base image
FROM node:alpine AS quasar
ADD ./package-quasar.json /tmp/package.json
RUN cd /tmp && npm install --verbose
RUN mkdir -p /generator/src /generator/config && \
	cp -a /tmp/node_modules /generator/ && cp -a /tmp/package-lock.json /generator/
WORKDIR /generator

# yarn stage
FROM quasar AS build
COPY config /generator/config
COPY src /generator/src
COPY .babelrc .editorconfig .env .eslintignore .eslintrc.js package.json .postcssrc.js  quasar.conf.js .stylintrc /generator/
RUN yarn install
RUN node node_modules/quasar-cli/bin/quasar build

# Runtime stage
FROM nginx:1.17.6 as release
LABEL maintainer="Datalake Team" description="Docker image for Datalake IHM intra"
RUN mkdir -p /www/ihm-intra
COPY --from=build /generator/dist/spa-mat /www/ihm-intra
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

FROM build as audit
USER root
RUN apk add --no-cache ca-certificates && update-ca-certificates
ADD https://get.aquasec.com/microscanner /
RUN chmod +x /microscanner
ARG token
RUN /microscanner NTZiYmRjOTdlNTEw --continue-on-failure
run yarn audit

