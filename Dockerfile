FROM node:10-alpine

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 5000

CMD ["node", "server.js"];