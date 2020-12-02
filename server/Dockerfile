FROM node:12

WORKDIR /app/server

ADD package.json package.json
RUN npm install 

COPY . .

EXPOSE 8080

CMD ["node", "."]