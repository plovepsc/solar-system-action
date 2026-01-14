FROM node:18-alpine3.17

WORKDIR /usr/app

COPY package*.json /usr/app/

RUN npm install

COPY . .

ENV MONGO_URI=mongodb+srv://cluster0.vhiyod5.mongodb.net/superdata?authSource=admin&replicaSet=atlas-g26qft-shard-0&retryWrites=true&w=majority&ssl=true
ENV MONGO_USERNAME=MONGO_USERNAME
ENV MONGO_PASSWORD=MONGO_PASSWORD

EXPOSE 3000

CMD [ "npm", "start" ]