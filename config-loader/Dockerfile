FROM node:10-alpine 

RUN npm set progress=false && npm config set depth 0 && npm cache clean --force

RUN mkdir /app

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

CMD [ "node", "index.js" ]