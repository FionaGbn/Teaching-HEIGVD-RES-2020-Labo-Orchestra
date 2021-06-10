FROM node:14.4

COPY . /opt/app/

WORKDIR /opt/app/

RUN npm install

ENTRYPOINT ["node", "/opt/app/src/auditor.js"]
