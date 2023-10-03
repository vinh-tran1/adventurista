import express from "express";
// import * as Express from "express";


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

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`Container listening on port ${port}`);
});
