# FROM node:10-alpine as builder
# WORKDIR /app
# COPY . .
# RUN npm install
# RUN npm run build

# # CMD ["node", "server.js"];

FROM nginx:1.13.3-alpine

## Copy our default nginx config
COPY nginx/default.conf /etc/nginx/conf.d/

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## From 'builder' stage copy over the artifacts in dist folder to default nginx public folder
COPY ./build/* /usr/share/nginx/html/

CMD ["nginx", "-g", "daemon off;"]


