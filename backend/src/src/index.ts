import express from "express";
import { DynamoDB } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import bcrypt from "bcrypt";
import userRoutes from "./users";
import eventRoutes from "./events";


// db set-up
// const db = new DynamoDB.DocumentClient();

const app = express();
const port = 80;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/users", userRoutes);
app.use("/events", eventRoutes);

app.get("/posts", (req, res) => {
  res.status(200).send("posts API");
});

app.get("/", (req, res) => {
  res.status(200).send("Healthy!");
});

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
