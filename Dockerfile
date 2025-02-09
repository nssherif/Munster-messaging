# syntax=docker/dockerfile:1
FROM --platform=linux/amd64 node:18-alpine
WORKDIR /
COPY . .
RUN npm install

CMD ["npm", "run", "start"]
EXPOSE 3000