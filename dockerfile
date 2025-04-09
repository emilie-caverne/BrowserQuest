FROM node:18
WORKDIR /BrowserQuest

COPY . .

RUN cd server && npm install
RUN cd client && npm install http-server --save-dev

EXPOSE  8080 8000

CMD bash -c "cd client && npx http-server -p 8080 & node server/js/main.js"

