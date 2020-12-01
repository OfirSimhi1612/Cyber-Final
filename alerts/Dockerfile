FROM node:12

WORKDIR /app/alerts

ADD package.json package.json
RUN npm install

COPY . .

EXPOSE 3001

CMD ["node", "."]