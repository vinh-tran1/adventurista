import express from "express";
import * as AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

const USERS_TABLE_NAME = process.env.USERS_TABLE_NAME || "";
const USERS_PRIMARY_KEY = process.env.USERS_PRIMARY_KEY || "";

const db = new AWS.DynamoDB.DocumentClient();

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

type User = {
  userId: string;
  firstName: string;
  lastName: string;
};

app.post("/user/create", async (req, res) => {
  const user: User = {
    userId: uuidv4(),
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };

  const params = {
    TableName: USERS_TABLE_NAME,
    Item: {
      userId: user.userId,
      created: moment().format("YYYYMMDD-hhmmss"),
      firstName: JSON.stringify(user.firstName),
      lastName: JSON.stringify(user.lastName),
    },
  };

  try {
    await db.put(params).promise();
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
});

app.get("/user/userId", (req, res) => {
  res.status(200).send("users API (post)");
});

app.get("/posts", (req, res) => {
  res.status(200).send("posts API");
});

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});
