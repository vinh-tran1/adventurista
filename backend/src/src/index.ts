import express from "express";
import { DynamoDB, S3 } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import bcrypt from "bcrypt";
import userRoutes from "./users";
import eventRoutes from "./events";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerOptions from "./swaggerDefinitions";


const app = express();
const port = 80;

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
