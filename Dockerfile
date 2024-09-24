FROM node:20 as build

# Create app directory
WORKDIR /usr/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

RUN npm run build

FROM node:20 as production

WORKDIR /usr/app

COPY --from=build /usr/app/package*.json ./
COPY --from=build /usr/app/dist ./dist

RUN npm install --only=production

EXPOSE 3000

CMD ["node", "dist/index.js"]
