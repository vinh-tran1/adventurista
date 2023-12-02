import express, { Request, Response } from "express";
import { DynamoDB } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { User } from "./models";
import { Event } from "./models";
import { GroupChat } from "./models";
import { Message } from "./models";
import { GROUP_CHAT_TABLE_NAME, MESSAGES_TABLE_NAME } from "./constants";

// db set-up
const db = new DynamoDB.DocumentClient();
const router = express.Router();

/**
 * @swagger
 * definitions:
 *   GroupChat:
 *     type: "object"
 *     required:
 *       - "name"
 *       - "event_id"
 *       - "user_ids"
 *     properties:
 *       groupId:
 *         type: "string"
 *       name:
 *         type: "string"
 *       event_id:
 *         type: "string"
 *       user_ids:
 *         type: "array"
 *         items:
 *           type: "string"
 *   Message:
 *     type: "object"
 *     required:
 *       - "groupId"
 *       - "userId"
 *       - "content"
 *     properties:
 *       messageId:
 *         type: "string"
 *       groupId:
 *         type: "string"
 *       userId:
 *         type: "string"
 *       content:
 *         type: "string"
 *       timestamp:
 *         type: "string"
 *       format: "date-time"
 */

export async function createGroupChat(name: string, event_id: string, user_ids: string[]): Promise<GroupChat> {
  const groupId = uuidv4();

  const newGroupChat: GroupChat = {
    groupId,
    name,
    event_id,
    user_ids,
  };

  const params = {
    TableName: GROUP_CHAT_TABLE_NAME,
    Item: newGroupChat,
  };

  try {
    await db.put(params).promise();
    return newGroupChat;
  } catch (err) {
    console.error("Error creating group chat:", err);
    return null;
  }
}

/**
 * @swagger
 * /create-group-chat:
 *   post:
 *     summary: "Create a new group chat"
 *     description: "Creates a new group chat"
 *     operationId: "createGroupChat"
 *     consumes:
 *       - "application/json"
 *     produces:
 *       - "application/json"
 *     parameters:
 *       - in: "body"
 *         name: "body"
 *         description: "Group chat object"
 *         required: true
 *         schema:
 *           $ref: "#/definitions/GroupChat"
 *     responses:
 *       "200":
 *         description: "Group chat created"
 *       "500":
 *         description: "Error creating group chat"
 */
router.post("/create-group-chat", async (req, res) => {
  const { name, event_id, user_ids } = req.body;
  const newGC: GroupChat = await createGroupChat(name, event_id, user_ids);

  if(newGC == null) {
    res.status(500).send("Error creating group chat");
  } else {
    res.status(200).json(newGC);
  }
});

export async function addMessage(groupId: string, userId: string, content: string): Promise<Message> {
  const messageId = uuidv4();
  const timestamp = moment().toISOString();

  const newMessage: Message = {
    messageId,
    groupId,
    userId,
    content,
    timestamp,
  };

  const params = {
    TableName: MESSAGES_TABLE_NAME,
    Item: newMessage,
  };

  try {
    await db.put(params).promise();
    return newMessage;
  } catch (err) {
    console.error("Error adding message:", err);
    return null;
  }
}

/**
 * @swagger
 * /add-message:
 *   post:
 *     summary: "Add a message to a group chat"
 *     description: "Adds a message to a specific group chat"
 *     operationId: "addMessage"
 *     consumes:
 *       - "application/json"
 *     produces:
 *       - "application/json"
 *     parameters:
 *       - in: "body"
 *         name: "body"
 *         description: "Message object"
 *         required: true
 *         schema:
 *           $ref: "#/definitions/Message"
 *     responses:
 *       "200":
 *         description: "Message added"
 *       "500":
 *         description: "Error adding message"
 */
router.post("/add-message", async (req, res) => {
  const { groupId, userId, content } = req.body;
  const newMessage: Message = await addMessage(groupId, userId, content);

  if (newMessage == null) {
    res.status(500).send("Error adding message");
  } else {
    res.status(200).json(newMessage);
  }
});

export async function deleteMessage(messageId: string): Promise<string> {
  const params = {
    TableName: MESSAGES_TABLE_NAME,
    Key: {
      messageId,
    },
  };

  try {
    await db.delete(params).promise();
    return "Message deleted successfully";
  } catch (err) {
    console.error("Error deleting message:", err);
    return null;
  }
}

/**
 * @swagger
 * /delete-message:
 *   delete:
 *     summary: "Delete a message from a group chat"
 *     description: "Deletes a message from a specific group chat"
 *     operationId: "deleteMessage"
 *     consumes:
 *       - "application/json"
 *     produces:
 *       - "application/json"
 *     parameters:
 *       - in: "body"
 *         name: "body"
 *         description: "Message object"
 *         required: true
 *         schema:
 *           $ref: "#/definitions/Message"
 *     responses:
 *       "200":
 *         description: "Message deleted"
 *       "500":
 *         description: "Error deleting message"
 */
router.delete("/delete-message", async (req, res) => {
  const { messageId } = req.body;
  const result = await deleteMessage(messageId);

  if (result == null) {
    res.status(500).send("Error deleting message");
  } else {
    res.status(200).send(result);
  }
});

export async function getGroupMessages(groupId: string): Promise<Message[]> {
  const params = {
    TableName: MESSAGES_TABLE_NAME,
    FilterExpression: "groupId = :groupId",
    ExpressionAttributeValues: {
      ":groupId": groupId,
    },
  };

  try {
    const result = await db.scan(params).promise();
    return result.Items as Message[];
  } catch (err) {
    console.error("Error retrieving messages:", err);
    return null;
  }
}

/**
 * @swagger
 * /get-group-messages/{groupId}:
 *   get:
 *     summary: "Retrieve all messages from a group chat"
 *     description: "Fetches all messages from a specific group chat"
 *     operationId: "getGroupMessages"
 *     produces:
 *       - "application/json"
 *     parameters:
 *       - name: "groupId"
 *         in: "path"
 *         description: "Group ID to fetch messages from"
 *         required: true
 *         type: "string"
 *     responses:
 *       "200":
 *         description: "Messages retrieved"
 *       "500":
 *         description: "Error retrieving messages"
 */
router.get("/get-group-messages/:groupId", async (req, res) => {
  const { groupId } = req.params;
  const messages = await getGroupMessages(groupId);

  if (messages == null) {
    res.status(500).send("Error retrieving messages");
  } else {
    res.status(200).json(messages);
  }
});

export async function getUserMessages(userId: string): Promise<Message[]> {
  const params = {
    TableName: MESSAGES_TABLE_NAME,
    FilterExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId,
    },
  };

  try {
    const result = await db.scan(params).promise();
    return result.Items as Message[];
  } catch (err) {
    console.error("Error retrieving user messages:", err);
    return null;
  }
}

/**
 * @swagger
 * /get-user-messages/{userId}:
 *   get:
 *     summary: "Retrieve all messages by a user"
 *     description: "Fetches all messages sent by a specific user"
 *     operationId: "getUserMessages"
 *     produces:
 *       - "application/json"
 *     parameters:
 *       - name: "userId"
 *         in: "path"
 *         description: "User ID to fetch messages from"
 *         required: true
 *         type: "string"
 *     responses:
 *       "200":
 *         description: "Messages retrieved"
 *       "500":
 *         description: "Error retrieving messages"
 */
router.get("/get-user-messages/:userId", async (req, res) => {
  const { userId } = req.params;
  const messages = await getUserMessages(userId);

  if (messages == null) {
    res.status(500).send("Error retrieving messages");
  } else {
    res.status(200).json(messages);
  }
});

export async function addUserToGroup(userId: string, groupId: string): Promise<string> {
  const groupParams = {
    TableName: GROUP_CHAT_TABLE_NAME,
    Key: {
      groupId,
    },
    UpdateExpression: "SET user_ids = list_append(user_ids, :userId)",
    ExpressionAttributeValues: {
      ":userId": [userId],
    },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    await db.update(groupParams).promise();
    return "User added to group chat successfully";
  } catch (err) {
    console.error("Error adding user to group chat:", err);
    return null
  }
}

/**
 * @swagger
 * /add-user-to-group:
 *   put:
 *     summary: "Add a user to a group chat"
 *     description: "Adds a new user to an existing group chat"
 *     operationId: "addUserToGroup"
 *     consumes:
 *       - "application/json"
 *     produces:
 *       - "application/json"
 *     parameters:
 *       - in: "body"
 *         name: "body"
 *         description: "User and group chat details"
 *         required: true
 *         schema:
 *           type: "object"
 *           required:
 *             - "groupId"
 *             - "userId"
 *           properties:
 *             groupId:
 *               type: "string"
 *             userId:
 *               type: "string"
 *     responses:
 *       "200":
 *         description: "User added to group chat"
 *       "500":
 *         description: "Error adding user to group chat"
 */
router.put("/add-user-to-group", async (req, res) => {
  const { groupId, userId } = req.body;
  const result = await addUserToGroup(userId, groupId);

  if (result == null) {
    res.status(500).send("Error adding user to group chat");
  } else {
    res.status(200).send(result);
  }
});

interface RemoveUserFromBody {
  groupId: string;
  userId: string;
}

export async function removeUserFromGroup(userId: string, groupId: string): Promise<string> {
  // Fetch the current group chat details
  const getParams = {
    TableName: GROUP_CHAT_TABLE_NAME,
    Key: {
      groupId,
    },
  };

  try {
    const groupChat = await db.get(getParams).promise();
    if (!groupChat.Item) {
      return "Group chat not found";
    }

    // Remove the user from the user_ids list
    const updatedUserIds = groupChat.Item.user_ids.filter(
      (id: string) => id !== userId
    );

    // Update the group chat with the new user_ids list
    const updateParams = {
      TableName: GROUP_CHAT_TABLE_NAME,
      Key: {
        groupId,
      },
      UpdateExpression: "SET user_ids = :userIds",
      ExpressionAttributeValues: {
        ":userIds": updatedUserIds,
      },
    };

    await db.update(updateParams).promise();
    return null;
  } catch (err) {
    console.error("Error removing user from group chat:", err);
    return "Error removing user from group chat";
  }
}

/**
 * @swagger
 * /remove-user-from-group:
 *   put:
 *     summary: "Remove a user from a group chat"
 *     description: "Removes a user from an existing group chat"
 *     operationId: "removeUserFromGroup"
 *     consumes:
 *       - "application/json"
 *     produces:
 *       - "application/json"
 *     parameters:
 *       - in: "body"
 *         name: "body"
 *         description: "User and group chat details"
 *         required: true
 *         schema:
 *           type: "object"
 *           required:
 *             - "groupId"
 *             - "userId"
 *           properties:
 *             groupId:
 *               type: "string"
 *             userId:
 *               type: "string"
 *     responses:
 *       "200":
 *         description: "User removed from group chat"
 *       "500":
 *         description: "Error removing user from group chat"
 */
router.put("/remove-user-from-group", async (req: Request, res: Response) => {
  const { groupId, userId } = req.body as RemoveUserFromBody;
  const result = await removeUserFromGroup(userId, groupId);

  if (result == null) { // special case. check impl in removeUserFromGroup
    res.status(200).send("User removed from group chat successfully");
  } else {
    res.status(500).send(result);
  }
});

export default router;
