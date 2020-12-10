FROM node:12

WORKDIR /app/crawler

ADD package.json package.json
RUN npm install

COPY . .

CMD ["node", "."]