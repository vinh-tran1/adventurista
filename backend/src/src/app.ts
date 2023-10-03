import express from "express";

const app = express();
const port = 80;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res
    .status(200)
    .send(
      "Hello Serverless APIGW with Application Load-Balanced Fargate Service!"
    );
});

app.get("/health", (req, res) => {
  res.status(200);
  res.send("healthy");
});

app.get("/works", (req, res) => {
  res.status(200);
  res.send("API Works!");
});

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`Container listening on port ${port}`);
});
