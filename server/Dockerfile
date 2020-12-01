FROM node:12

WORKDIR /app/server

ADD package.json package.json
RUN npm install

ADD wait-for-it.sh wait-for-it.sh
RUN chmod +x wait-for-it.sh 

COPY . .

EXPOSE 8080

CMD ["node", "."]