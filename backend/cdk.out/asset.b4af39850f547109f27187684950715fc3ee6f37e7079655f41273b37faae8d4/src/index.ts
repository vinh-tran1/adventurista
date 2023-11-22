import express from "express";
import { DynamoDB, S3 } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import bcrypt from "bcrypt";
import userRoutes from "./users";
import eventRoutes from "./events";
import messageRoutes from "./messages";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerDefinition from "./swaggerDefinitions";

const app = express();
const port = 80;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/users", userRoutes);
app.use("/events", eventRoutes);
app.use("/messages", messageRoutes);

const swaggerSpec = swaggerJsdoc(swaggerDefinition);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/posts", (req, res) => {
  res.status(200).send("posts API");
});

/**
 * @swagger
 * /:
 *   get:
 *     summary: Returns a health check
 *     description: A sanity check
 *     responses:
 *       200:
 *         description: Greeting message
 */

app.get("/health", (req, res) => {
  res.status(200).send("Healthy!");
});
app.get("/", (req, res) => {
  res.status(200).send("Healthy!");
});

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
