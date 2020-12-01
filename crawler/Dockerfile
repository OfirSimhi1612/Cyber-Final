FROM buildkite/puppeteer:5.2.1

WORKDIR /app/crawler

ADD package.json package.json
RUN npm install

ADD wait-for-it.sh wait-for-it.sh
RUN chmod +x wait-for-it.sh 

COPY . .

CMD ["node", "."]