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
# entrypoint replace apiUrl:".*?" by apiUrl:"$API_URL" in all js files
# API_URL is declared in the environment section of docker-compose file
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
RUN mkdir -p /www/
COPY --from=build /generator/dist/spa-mat /www/
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
ENTRYPOINT [ "/usr/local/bin/entrypoint.sh" ]
CMD ["nginx", "-g", "daemon off;"]

FROM release as audit
USER root
RUN apt-get update && apt-get -y install ca-certificates
ADD https://get.aquasec.com/microscanner /
RUN chmod +x /microscanner
ARG token
RUN /microscanner NTZiYmRjOTdlNTEw --continue-on-failure
