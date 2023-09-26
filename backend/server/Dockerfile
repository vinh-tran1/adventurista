    FROM node:alpine
    WORKDIR /usr/server
    COPY package.json .
    RUN npm install\
        && npm install typescript -g
    COPY . .
	EXPOSE 3000
    RUN tsc
    CMD ["node", "./dist/app.js"]
