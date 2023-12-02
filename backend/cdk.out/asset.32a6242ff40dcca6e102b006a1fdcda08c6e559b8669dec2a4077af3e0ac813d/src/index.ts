import express from "express";

const app = express();
const port = 80;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Hello Serverless APIGW with Application Load-Balanced Fargate Service!");
});

app.get("/user", (req, res) => {
  res.status(200).send("users API");
});

app.post("/user", (req, res) => {
  res.status(200).send("users API (post)");
});

app.get("/posts", (req, res) => {
  res.status(200).send("posts API");
});

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});
