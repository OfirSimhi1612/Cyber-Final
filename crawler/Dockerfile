FROM buildkite/puppeteer:5.2.1

WORKDIR /app/crawler

ADD package.json package.json
RUN npm install

COPY . .

CMD ["node", "."]