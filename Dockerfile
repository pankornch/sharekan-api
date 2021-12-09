FROM node:alpine

ENV POSTGRES_URI=
ENV JWT_SECRET=

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 4000

CMD ["npm", "start"]