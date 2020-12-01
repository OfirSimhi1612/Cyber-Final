FROM node:13.12.0-alpine

WORKDIR /app/client

ADD package.json package.json

RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent

COPY . .

CMD ["npm", "run", "build"]