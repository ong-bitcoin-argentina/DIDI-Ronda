# This docker file is not intented for developing evironments
# since it doesn't permit hotreload easily
FROM node:12 as builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm ci --only=prod

# Bundle app source
COPY . .

EXPOSE 3200

CMD [ "node", "app.js" ]