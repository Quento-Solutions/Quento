FROM node:12

ENV host '0.0.0.0'
ENV port 80
EXPOSE 80

WORKDIR /usr/src/
RUN mkdir /usr/src/content
COPY package*.json ./
RUN git pull --recurse-submodules
RUN npm install

COPY . .

RUN npm run test

RUN npm run build

CMD ["npm", "run", "start"]

