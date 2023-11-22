# TypeScript Express server without Docker

Run the following to start the server on localhost port 80:

```bash
npm install
npm run start
```

# TypeScript Express server with Docker

Run the following to start the server on container port 80:

```bash
docker build . -t ts-adventurista
docker run -p 80:80 --name adventurista ts-adventurista
```
