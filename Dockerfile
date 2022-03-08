FROM node:alpine

# create app directory
RUN mkdir -p /app
WORKDIR /app

# install app dependencies
COPY package.json /app
COPY package-lock.json /app
RUN npm install

COPY . /app
EXPOSE 8001

CMD ["npm", "run", "start"]


