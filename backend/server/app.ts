import { Express } from 'express';
var express = require('express');

const app:Express = express();
const port = 80;

app.get("/health", (req, res) => {
  res.status(200);
  res.send("healthy");
});

app.listen(port, () => {
  return console.log(`Container listening on port ${port}`);
});
