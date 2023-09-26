import express from "express";
const app = express();
const port = 3000;

app.get("/health", (req, res) => {
  res.status(200);
  res.send("healthy");
});

app.listen(port, () => {
  return console.log(`Container listening on port ${port}`);
});
