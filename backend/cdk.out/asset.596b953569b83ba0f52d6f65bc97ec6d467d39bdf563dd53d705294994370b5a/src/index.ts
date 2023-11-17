import express from "express";
import * as AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const USERS_TABLE_NAME = process.env.USERS_TABLE_NAME || "";
const USERS_PRIMARY_KEY = process.env.USERS_PRIMARY_KEY || "";

const db = new AWS.DynamoDB.DocumentClient();

const app = express();
const port = 80;
const RESERVED_RESPONSE = `Error: You're using AWS reserved keywords as attributes`,
  DYNAMODB_EXECUTION_ERROR = `Error: Execution update, caused a Dynamodb error, please take a look at your CloudWatch Logs.`;

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
  USERS_PRIMARY_KEY: string;
  firstName: string;
  lastName: string;
};

app.post("/user/create", async (req, res) => {
  const user: User = {
    USERS_PRIMARY_KEY: uuidv4(),
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };

  const params = {
    TableName: USERS_TABLE_NAME,
    Item: user,
  };

  try {
    await db.put(params).promise();
    res.status(200).send(user);
  } catch (dbError) {
    const errorResponse =
      dbError.code === "ValidationException" &&
      dbError.message.includes("reserved keyword")
        ? RESERVED_RESPONSE
        : DYNAMODB_EXECUTION_ERROR;
    return { statusCode: 500, body: errorResponse };
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
