import express from "express";
import { DynamoDB, S3 } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import bcrypt from "bcrypt";
import { User } from "./models";
import { Event } from "./models";
import {
  USERS_TABLE_NAME,
  USERS_PRIMARY_KEY,
  PROF_PIC_BUCKET,
  PRESIGNED_URL_EXPIRATION_SECONDS,
} from "./constants";

// db set-up
const db = new DynamoDB.DocumentClient();
const s3 = new S3();
const router = express.Router();

const saltRounds = 10;
/**
 * @swagger
 * definitions:
 *   User:
 *     type: "object"
 *     required:
 *       - "email"
 *       - "userId"
 *       - "firstName"
 *       - "lastName"
 *       - "hashedPassword"
 *       - "primaryLocation"
 *       - "blockedUsers"
 *       - "interests"
 *       - "friends"
 *       - "requests"
 *       - "groups"
 *       - "eventsOwned"
 *       - "eventsGoingTo"
 *       - "eventsNotGoingTo"
 *       - "messages"
 *       - "profilePictureUrl"
 *     properties:
 *       email:
 *         type: "string"
 *       userId:
 *         type: "string"
 *       firstName:
 *         type: "string"
 *       lastName:
 *         type: "string"
 *       hashedPassword:
 *         type: "string"
 *       primaryLocation:
 *         type: "string"
 *       blockedUsers:
 *         type: "array"
 *         items:
 *           type: "string"
 *       interests:
 *         type: "array"
 *         items:
 *           type: "string"
 *       friends:
 *         type: "array"
 *         items:
 *           type: "string"
 *       requests:
 *         type: "object"
 *         properties:
 *           outgoing:
 *             type: "array"
 *             items:
 *               type: "string"
 *           incoming:
 *             type: "array"
 *             items:
 *               type: "string"
 *       groups:
 *         type: "array"
 *         items:
 *           type: "string"
 *       eventsOwned:
 *         type: "array"
 *         items:
 *           type: "string"
 *       eventsGoingTo:
 *         type: "array"
 *         items:
 *           type: "string"
 *       eventsNotGoingTo:
 *         type: "array"
 *         items:
 *           type: "string"
 *       messages:
 *         type: "array"
 *         items:
 *           type: "string"
 *       profilePictureUrl:
 *         type: "string"
 *
 *   Event:
 *     type: "object"
 *     required:
 *       - "eventId"
 *       - "title"
 *       - "description"
 *       - "time"
 *       - "location"
 *       - "postingUserId"
 *       - "blockedUsers"
 *       - "photo"
 *       - "whoIsGoing"
 *     properties:
 *       eventId:
 *         type: "string"
 *       title:
 *         type: "string"
 *       description:
 *         type: "string"
 *       time:
 *         type: "string"
 *       location:
 *         type: "string"
 *       postingUserId:
 *         type: "string"
 *       blockedUsers:
 *         type: "array"
 *         items:
 *           type: "string"
 *       photo:
 *         type: "string"
 *       whoIsGoing:
 *         type: "array"
 *         items:
 *           type: "string"
 *   Credentials:
 *     type: "object"
 *     required:
 *       - "email"
 *       - "password"
 *     properties:
 *       email:
 *         type: "string"
 *       password:
 *         type: "string"
 *
 *   FriendRequest:
 *     type: "object"
 *     required:
 *       - "requesterId"
 *       - "requestId"
 *     properties:
 *       requesterId:
 *         type: "string"
 *       requestId:
 *         type: "string"
 *
 *   UserId:
 *     type: "object"
 *     required:
 *       - "userId"
 *     properties:
 *       userId:
 *         type: "string"
 *
 *   BlockUnblockRequest:
 *     type: "object"
 *     required:
 *       - "blockerId"
 *       - "blockedUserId"
 *     properties:
 *       blockerId:
 *         type: "string"
 *       blockedUserId:
 *         type: "string"
 *
 *   ProfilePicKey:
 *     type: "object"
 *     required:
 *       - "Key"
 *     properties:
 *       Key:
 *         type: "string"
 */

router.get("/sanity-check", async (req, res) => {
  res.status(200).send("Healthy!");
});

/**
 * @swagger
 * /auth/create-user:
 *   post:
 *     summary: "Create a new user"
 *     description: "Registers a new user in the system"
 *     operationId: "createUser"
 *     consumes:
 *       - "application/json"
 *     produces:
 *       - "application/json"
 *     parameters:
 *       - in: "body"
 *         name: "body"
 *         description: "User object that needs to be created"
 *         required: true
 *         schema:
 *           $ref: "#/definitions/User"
 *     responses:
 *       "201":
 *         description: "User created"
 *       "400":
 *         description: "Invalid input"
 */
router.post("/auth/create-user", async (req, res) => {
  const { email, firstName, lastName, password } = req.body;

  // res.status(201).send(email);

  const result = await createUser(email, firstName, lastName, password);
  if (typeof result === "string") {
    return res.status(400).send(result);
  }

  res.status(201).send(result);
});

async function signIn(email: string, password: string): Promise<User | false> {
  // Retrieve user based on email
  const params = {
    TableName: USERS_TABLE_NAME,
    Key: {
      [USERS_PRIMARY_KEY]: email, // Assuming USERS_PRIMARY_KEY is now set to "email"
    },
  };

  try {
    const result = await db.get(params).promise();
    const user = result.Item as User;

    if (!user) return false;

    // Compare the password with the hashed password
    const isPasswordValid = await comparePassword(
      password,
      user.hashedPassword
    );
    if (!isPasswordValid) return false;

    return user;
  } catch (err) {
    console.error("Error during sign-in:", err);
    return false;
  }
}

/**
 * @swagger
 * /auth/sign-in:
 *   post:
 *     summary: "Sign in a user"
 *     description: "Authenticates a user and returns their details"
 *     operationId: "signIn"
 *     consumes:
 *       - "application/json"
 *     produces:
 *       - "application/json"
 *     parameters:
 *       - in: "body"
 *         name: "body"
 *         description: "User credentials"
 *         required: true
 *         schema:
 *           $ref: "#/definitions/Credentials"
 *     responses:
 *       "200":
 *         description: "Successful operation"
 *       "400":
 *         description: "Invalid credentials"
 */
router.post("/auth/sign-in", async (req, res) => {
  const { email, password } = req.body;

  const user = await signIn(email, password);
  if (!user) {
    return res.status(400).send("Invalid credentials");
  }

  res.status(200).send(user);
});

async function getUser(userId: string): Promise<User | null> {
  const params = {
    TableName: USERS_TABLE_NAME,
    Key: {
      [USERS_PRIMARY_KEY]: userId,
    },
  };

  try {
    const result = await db.get(params).promise();
    return result.Item as User;
  } catch (err) {
    console.error("Error getting user:", err);
    return null;
  }
}

async function updateUser(user: User): Promise<User | null> {
  const params = {
    TableName: USERS_TABLE_NAME,
    Key: {
      [USERS_PRIMARY_KEY]: user.userId,
    },
    UpdateExpression:
      "SET primaryLocation = :primaryLocation, firstName = :firstName, lastName = :lastName, interests= :interests",
    ExpressionAttributeValues: {
      ":primaryLocation": user.primaryLocation,
      ":firstName": user.firstName,
      ":lastName": user.lastName,
      ":interests": user.interests,
    },
  };

  try {
    await db.update(params).promise();
    return user;
  } catch (err) {
    console.error("Error updating user:", err);
    return null;
  }
}

/**
 * @swagger
 * /update-user:
 *   post:
 *     summary: "Update an existing user"
 *     description: "Updates an existing user in the system"
 *     operationId: "updateUser"
 *     consumes:
 *       - "application/json"
 *     produces:
 *       - "application/json"
 *     parameters:
 *       - in: "body"
 *         name: "body"
 *         description: "Updated user object"
 *         required: true
 *         schema:
 *           $ref: "#/definitions/User"
 *     responses:
 *       "200":
 *         description: "User updated"
 *       "400":
 *         description: "Invalid input"
 *       "404":
 *         description: "User not found"
 */
router.post("/update-user", async (req, res) => {
  const user = await getUser(req.body.userId);
  if (!user) {
    return res.status(404).send("User not found");
  }
  user.primaryLocation = req.body.primaryLocation;
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.interests = req.body.interests;

  const result = updateUser(user);
  if (!result) {
    return res.status(400).send("Error updating user");
  }

  res.status(200).send(result);
});
async function sendFriendRequest(
  requesterId: string,
  requestId: string
): Promise<string | null> {
  // Fetch users from a database.
  const requester: User | null = await getUser(requesterId);
  const requestee: User | null = await getUser(requestId);

  if (!requester || !requestee) {
    return null;
  }

  // Add logic to update `requests` in the database.
  requester.requests.outgoing.push(requestId);
  requestee.requests.incoming.push(requesterId);

  // Save updated users back to the database.
  const requesterParams = {
    TableName: USERS_TABLE_NAME,
    Key: {
      [USERS_PRIMARY_KEY]: requester.userId,
    },
    UpdateExpression: "SET requests.outgoing = :outgoing",
    ExpressionAttributeValues: {
      ":outgoing": requester.requests.outgoing,
    },
  };

  try {
    await db.update(requesterParams).promise();
  } catch (err) {
    console.error("Error friend requesting user:", err);
    return null;
  }

  const requesteeParams = {
    TableName: USERS_TABLE_NAME,
    Key: {
      [USERS_PRIMARY_KEY]: requestee.userId,
    },
    UpdateExpression: "SET requests.incoming = :incoming",
    ExpressionAttributeValues: {
      ":incoming": requestee.requests.incoming,
    },
  };

  try {
    await db.update(requesteeParams).promise();
  } catch (err) {
    console.error("Error friend requesting user:", err);
    return null;
  }

  return "Friend request sent";
}

/**
 * @swagger
 * /friend-request:
 *   post:
 *     summary: "Send a friend request"
 *     description: "Sends a friend request from one user to another"
 *     operationId: "sendFriendRequest"
 *     consumes:
 *       - "application/json"
 *     produces:
 *       - "application/json"
 *     parameters:
 *       - in: "body"
 *         name: "body"
 *         description: "IDs of requester and requestee"
 *         required: true
 *         schema:
 *           $ref: "#/definitions/FriendRequest"
 *     responses:
 *       "200":
 *         description: "Friend request sent"
 *       "404":
 *         description: "Friend request unable to be processed"
 */
router.post("/friend-request", async (req, res) => {
  const { requesterId, requestId } = req.body;
  const result = await sendFriendRequest(requesterId, requestId);
  if (!result) {
    return res.status(404).send("Friend request unable to be processed");
  }
  res.status(200).send(result);
});

async function unaddFriend(
  requesterId: string,
  requestId: string
): Promise<string | null> {
  // Fetch users from a database.
  const requester: User | null = await getUser(requesterId);
  const requestee: User | null = await getUser(requestId);

  if (!requester || !requestee) {
    return null;
  }

  if (
    !requester.friends.includes(requestId) ||
    !requestee.friends.includes(requesterId)
  ) {
    return null;
  }

  // Remove friend from each other's list
  const i = requester.friends.indexOf(requestId);
  const j = requestee.friends.indexOf(requesterId);
  requester.friends.splice(i, 1);
  requestee.friends.splice(j, 1);

  // Save updated users back to the database.
  const requesterParams = {
    TableName: USERS_TABLE_NAME,
    Key: {
      [USERS_PRIMARY_KEY]: requester.userId,
    },
    UpdateExpression: "SET friends = :friends",
    ExpressionAttributeValues: {
      ":friends": requester.friends,
    },
  };

  try {
    await db.update(requesterParams).promise();
  } catch (err) {
    console.error("Error unadding friend:", err);
    return null;
  }

  const requesteeParams = {
    TableName: USERS_TABLE_NAME,
    Key: {
      [USERS_PRIMARY_KEY]: requestee.userId,
    },
    UpdateExpression: "SET friends = :friends",
    ExpressionAttributeValues: {
      ":friends": requestee.friends,
    },
  };

  try {
    await db.update(requesteeParams).promise();
  } catch (err) {
    console.error("Error unadding friend:", err);
    return null;
  }

  return "Friend unadd processed";
}
/**
 * @swagger
 *   /friend-request/unadd:
 *     post:
 *       summary: "Unadd a friend"
 *       description: ""
 *       operationId: "unaddFriend"
 *       consumes:
 *         - "application/json"
 *       produces:
 *         - "application/json"
 *       parameters:
 *         - in: "body"
 *           name: "body"
 *           description: "IDs of users involved in unadding"
 *           required: true
 *           schema:
 *             $ref: "#/definitions/FriendRequest"
 *       responses:
 *         "200":
 *           description: "Friend unadded"
 *         "404":
 *           description: "Unable to process friend unadd"
 *
 */
router.post("/friend-request/unadd", async (req, res) => {
  const { requesterId, requestId } = req.body;
  const result = await unaddFriend(requesterId, requestId);
  if (!result) {
    return res.status(404).send("Friend unadd unable to be processed");
  }
  res.status(200).send(result);
});

async function acceptFriendRequest(
  requesterId: string,
  requestId: string
): Promise<string | null> {
  // Fetch users from a database.
  const requester: User | null = await getUser(requesterId);
  const requestee: User | null = await getUser(requestId);

  if (!requester || !requestee) {
    return null;
  }

  if (
    !requester.requests.outgoing.includes(requestId) ||
    !requestee.requests.incoming.includes(requesterId)
  ) {
    return null;
  }

  // Remove incoming and outgoing requests
  const i = requester.requests.outgoing.indexOf(requestId);
  const j = requestee.requests.incoming.indexOf(requesterId);
  requester.requests.outgoing.splice(i, 1);
  requestee.requests.incoming.splice(j, 1);

  // Add to friends list
  requester.friends.push(requestId);
  requestee.friends.push(requesterId);

  // Save updated users back to the database.
  const requesterParams = {
    TableName: USERS_TABLE_NAME,
    Key: {
      [USERS_PRIMARY_KEY]: requester.userId,
    },
    UpdateExpression: "SET requests.outgoing = :outgoing, friends = :friends",
    ExpressionAttributeValues: {
      ":outgoing": requester.requests.outgoing,
      ":friends": requester.friends,
    },
  };

  try {
    await db.update(requesterParams).promise();
  } catch (err) {
    console.error("Error accepting friend request:", err);
    return null;
  }

  const requesteeParams = {
    TableName: USERS_TABLE_NAME,
    Key: {
      [USERS_PRIMARY_KEY]: requestee.userId,
    },
    UpdateExpression: "SET requests.incoming = :incoming, friends = :friends",
    ExpressionAttributeValues: {
      ":incoming": requestee.requests.incoming,
      ":friends": requestee.friends,
    },
  };

  try {
    await db.update(requesteeParams).promise();
  } catch (err) {
    console.error("Error accepting friend request:", err);
    return null;
  }

  return "Friend request accepted";
}
/**
 * @swagger
 * /friend-request/accept:
 *     post:
 *       summary: "Accept a friend request"
 *       description: ""
 *       operationId: "acceptFriendRequest"
 *       consumes:
 *         - "application/json"
 *       produces:
 *         - "application/json"
 *       parameters:
 *         - in: "body"
 *           name: "body"
 *           description: "IDs of users involved in accepting friend request"
 *           required: true
 *           schema:
 *             $ref: "#/definitions/FriendRequest"
 *       responses:
 *         "200":
 *           description: "Friend request accepted"
 *         "404":
 *           description: "Unable to process friend request acceptance"
 */
router.post("/friend-request/accept", async (req, res) => {
  const { requesterId, requestId } = req.body;
  const result = await acceptFriendRequest(requesterId, requestId);
  if (!result) {
    return res
      .status(404)
      .send("Friend request acceptance unable to be processed");
  }
  res.status(200).send(result);
});

async function denyFriendRequest(
  requesterId: string,
  requestId: string
): Promise<string | null> {
  // Fetch users from a database.
  const requester: User | null = await getUser(requesterId);
  const requestee: User | null = await getUser(requestId);

  if (!requester || !requestee) {
    return null;
  }

  if (
    !requester.requests.outgoing.includes(requestId) ||
    !requestee.requests.incoming.includes(requesterId)
  ) {
    return null;
  }

  // Remove incoming and outgoing requests
  const i = requester.requests.outgoing.indexOf(requestId);
  const j = requestee.requests.incoming.indexOf(requesterId);
  requester.requests.outgoing.splice(i, 1);
  requestee.requests.incoming.splice(j, 1);

  // Save updated users back to the database.
  const requesterParams = {
    TableName: USERS_TABLE_NAME,
    Key: {
      [USERS_PRIMARY_KEY]: requester.userId,
    },
    UpdateExpression: "SET requests.outgoing = :outgoing",
    ExpressionAttributeValues: {
      ":outgoing": requester.requests.outgoing,
    },
  };

  try {
    await db.update(requesterParams).promise();
  } catch (err) {
    console.error("Error accepting friend request:", err);
    return null;
  }

  const requesteeParams = {
    TableName: USERS_TABLE_NAME,
    Key: {
      [USERS_PRIMARY_KEY]: requestee.userId,
    },
    UpdateExpression: "SET requests.incoming = :incoming",
    ExpressionAttributeValues: {
      ":incoming": requestee.requests.incoming,
    },
  };

  try {
    await db.update(requesteeParams).promise();
  } catch (err) {
    console.error("Error accepting friend request:", err);
    return null;
  }

  return "Friend request denied";
}
/**
 * @swagger
 * /friend-request/deny:
 *     post:
 *       summary: "Deny a friend request"
 *       description: ""
 *       operationId: "denyFriendRequest"
 *       consumes:
 *         - "application/json"
 *       produces:
 *         - "application/json"
 *       parameters:
 *         - in: "body"
 *           name: "body"
 *           description: "IDs of users involved in denying friend request"
 *           required: true
 *           schema:
 *             $ref: "#/definitions/FriendRequest"
 *       responses:
 *         "200":
 *           description: "Friend request denied"
 *         "404":
 *           description: "Unable to process friend request denial"
 */
router.post("/friend-request/deny", async (req, res) => {
  const { requesterId, requestId } = req.body;
  const result = await denyFriendRequest(requesterId, requestId);
  if (!result) {
    return res.status(404).send("Friend request denial unable to be processed");
  }
  res.status(200).send(result);
});
/**
 * @swagger
 * /get-friends-of-user:
 *     get:
 *       summary: "Get friends of a user"
 *       description: "Returns a list of friends for a given user"
 *       operationId: "getFriendsOfUser"
 *       produces:
 *         - "application/json"
 *       parameters:
 *         - in: "body"
 *           name: "body"
 *           description: "User ID to fetch friends for"
 *           required: true
 *           schema:
 *             $ref: "#/definitions/UserId"
 *       responses:
 *         "200":
 *           description: "Successful operation"
 *         "404":
 *           description: "User not found"
 */
router.get("/get-friends-of-user", async (req, res) => {
  const { userId } = req.body;
  const user: User | null = await getUser(userId);

  if (!user) {
    return res.status(404).send("User not found");
  }

  const users: User[] = [];
  user.friends.forEach(async (userId) => {
    const user: User | null = await getUser(userId);

    if (user) {
      users.push(user);
    }
  });

  res.status(200).send(users);
});

/**
 * @swagger
 * /get-friends-of-user-ids:
 *     get:
 *       summary: "Get friends IDs of a user"
 *       description: "Returns a list of friends IDs for a given user"
 *       operationId: "getFriendsOfUserIds"
 *       produces:
 *         - "application/json"
 *       parameters:
 *         - in: "body"
 *           name: "body"
 *           description: "User ID to fetch friends IDs for"
 *           required: true
 *           schema:
 *             $ref: "#/definitions/UserId"
 *       responses:
 *         "200":
 *           description: "Successful operation"
 *         "404":
 *           description: "User not found"
 */
router.get("/get-friends-of-user-ids", async (req, res) => {
  const { userId } = req.body;
  const user: User | null = await getUser(userId);

  if (!user) {
    return res.status(404).send("User not found");
  }

  res.status(200).send(user.friends);
});

async function blockUser(
  blockerId: string,
  blockedUserId: string
): Promise<User | null> {
  const blocker: User | null = await getUser(blockerId);

  if (!blocker) {
    return null;
  }

  if (blocker.blockedUsers.includes(blockedUserId)) {
    return null;
  }

  // Add logic to update `blockedUsers` in the database.
  blocker.blockedUsers.push(blockedUserId);

  // Save updated user back to the database.
  const params = {
    TableName: USERS_TABLE_NAME,
    Key: {
      [USERS_PRIMARY_KEY]: blocker.userId,
    },
    UpdateExpression: "SET blockedUsers = :blockedUsers",
    ExpressionAttributeValues: {
      ":blockedUsers": blocker.blockedUsers,
    },
  };

  try {
    await db.update(params).promise();
    return blocker;
  } catch (err) {
    console.error("Error blocking user:", err);
    return null;
  }
}
/**
 * @swagger
 * /block-user:
 *     post:
 *       summary: "Block a user"
 *       description: ""
 *       operationId: "blockUser"
 *       consumes:
 *         - "application/json"
 *       produces:
 *         - "application/json"
 *       parameters:
 *         - in: "body"
 *           name: "body"
 *           description: "IDs of blocker and blocked user"
 *           required: true
 *           schema:
 *             $ref: "#/definitions/BlockUnblockRequest"
 *       responses:
 *         "200":
 *           description: "User blocked"
 *         "404":
 *           description: "Unable to block user"
 */
router.post("/block-user", async (req, res) => {
  const { blockerId, blockedUserId } = req.body;
  const result = await blockUser(blockerId, blockedUserId);
  if (!result) {
    return res.status(404).send("Blocking user not found");
  }
  res.status(200).send(result);
});

async function unblockUser(
  unblockerId: string,
  blockedUserId: string
): Promise<User | null> {
  const blocker: User | null = await getUser(unblockerId);

  if (!blocker) {
    return null;
  }

  if (!blocker.blockedUsers.includes(blockedUserId)) {
    return null;
  }

  const i = blocker.blockedUsers.indexOf(blockedUserId);
  blocker.blockedUsers.splice(i, 1);

  // Save updated user back to the database.
  const params = {
    TableName: USERS_TABLE_NAME,
    Key: {
      [USERS_PRIMARY_KEY]: blocker.userId,
    },
    UpdateExpression: "SET blockedUsers = :blockedUsers",
    ExpressionAttributeValues: {
      ":blockedUsers": blocker.blockedUsers,
    },
  };

  try {
    await db.update(params).promise();
    return blocker;
  } catch (err) {
    console.error("Error unblocking user:", err);
    return null;
  }
}
/**
 * @swagger
 * /unblock-user:
 *     post:
 *       summary: "Unblock a user"
 *       description: ""
 *       operationId: "unblockUser"
 *       consumes:
 *         - "application/json"
 *       produces:
 *         - "application/json"
 *       parameters:
 *         - in: "body"
 *           name: "body"
 *           description: "IDs of unblocker and blocked user"
 *           required: true
 *           schema:
 *             $ref: "#/definitions/BlockUnblockRequest"
 *       responses:
 *         "200":
 *           description: "User unblocked"
 *         "404":
 *           description: "Unable to unblock user"
 */
router.post("/unblock-user", async (req, res) => {
  const { unblockerId, blockedUserId } = req.body;
  const result = await unblockUser(unblockerId, blockedUserId);
  if (!result) {
    return res.status(404).send("Unblocking user not found");
  }
  res.status(200).send(result);
});

// profile picture bucket read/write
const getProfilePicUploadURL = async function () {
  const randomID = uuidv4();
  const Key = `${randomID}.jpg`;

  // Get signed URL from S3
  const s3Params = {
    Bucket: PROF_PIC_BUCKET,
    Key,
    Expires: PRESIGNED_URL_EXPIRATION_SECONDS,
    ContentType: "image/jpeg",
    // ACL: 'public-read'
  };

  console.log("Params: ", s3Params);
  const uploadURL = await s3.getSignedUrlPromise("putObject", s3Params);

  return JSON.stringify({
    uploadURL: uploadURL,
    Key,
  });
};
/**
 * @swagger
 * /profile-pic-presigned:
 *     get:
 *       summary: "Get presigned URL for profile picture upload"
 *       description: "Returns a presigned URL for uploading profile picture to S3"
 *       operationId: "getProfilePicUploadURL"
 *       produces:
 *         - "application/json"
 *       responses:
 *         "200":
 *           description: "Presigned URL generated"
 */
router.get("/profile-pic-presigned", async (req, res) => {
  const url = await getProfilePicUploadURL();
  return res.status(200).send(url);
});
/**
 * @swagger
 * /profile-pic-as-bytes:
 *     get:
 *       summary: "Get profile picture as bytes"
 *       description: "Returns the profile picture as bytes"
 *       operationId: "getProfilePicAsBytes"
 *       consumes:
 *         - "application/json"
 *       produces:
 *         - "application/json"
 *       parameters:
 *         - in: "body"
 *           name: "body"
 *           description: "Key of the profile picture in S3 bucket"
 *           required: true
 *           schema:
 *             $ref: "#/definitions/ProfilePicKey"
 *       responses:
 *         "200":
 *           description: "Profile picture fetched"
 *         "400":
 *           description: "Error fetching profile picture"
 */
router.get("/profile-pic-as-bytes", async (req, res) => {
  const params = {
    Bucket: PROF_PIC_BUCKET,
    Key: req.body.Key,
  };

  try {
    const data = await s3.getObject(params).promise();
    return res.status(200).send({ body: data.Body });
  } catch (err) {
    return res.send(err);
  }
});

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, saltRounds);
}

async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

async function emailExists(email: string): Promise<boolean> {
  const params = {
    TableName: USERS_TABLE_NAME,
    Key: {
      [USERS_PRIMARY_KEY]: email, // Assuming USERS_PRIMARY_KEY is now set to "email"
    },
  };

  try {
    const result = await db.get(params).promise();
    return !!result.Item; // Returns true if an item exists, false otherwise
  } catch (err) {
    console.error("Error checking email:", err);
    return false; // Default to false on error
  }
}

async function createUser(
  email: string,
  firstName: string,
  lastName: string,
  password: string
): Promise<User | string> {
  // Check if email already exists
  if (await emailExists(email)) {
    return "Email already in use";
  }
  // Hash the password
  const hashedPassword = await hashPassword(password);

  const user: User = {
    email: email,
    userId: uuidv4(),
    firstName: firstName,
    lastName: lastName,
    hashedPassword: hashedPassword,
    primaryLocation: "",
    blockedUsers: [],
    interests: [],
    friends: [],
    requests: {
      outgoing: [],
      incoming: [],
    },
    groups: [],
    eventsOwned: [],
    eventsGoingTo: [],
    eventsNotGoingTo: [],
    messages: [],
    profilePictureUrl: "",
  };

  const params = {
    TableName: USERS_TABLE_NAME,
    Item: user,
  };

  try {
    await db.put(params).promise();
    return user;
  } catch (err) {
    console.error("Error creating user:", err);
    return "Error creating user";
  }
}

/**
 * @swagger
 * /{userId}:
 *   get:
 *     summary: "Get user by ID"
 *     description: "Returns a single user based on their ID"
 *     operationId: "getUser"
 *     produces:
 *       - "application/json"
 *     parameters:
 *       - in: "path"
 *         name: "userId"
 *         description: "ID of the user to return"
 *         required: true
 *         type: "string"
 *     responses:
 *       "200":
 *         description: "Successful operation"
 *       "404":
 *         description: "User not found"
 */
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  const user = await getUser(userId);
  if (!user) {
    return res.status(404).send("User not found");
  }
  res.status(200).send(user);
});

export default router;
