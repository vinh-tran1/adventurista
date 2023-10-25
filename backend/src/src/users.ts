import express from "express";
import { DynamoDB } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import bcrypt from "bcrypt";
import { User } from "./models";
import { Event } from "./models";
import { USERS_TABLE_NAME, USERS_PRIMARY_KEY } from "./constants";


// db set-up
const db = new DynamoDB.DocumentClient();
const router = express.Router();

const saltRounds = 10;

async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, saltRounds);
}

async function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

async function emailExists(email: string): Promise<boolean> {
    const params = {
        TableName: USERS_TABLE_NAME,
        Key: {
            [USERS_PRIMARY_KEY]: email,  // Assuming USERS_PRIMARY_KEY is now set to "email"
        },
    };

    try {
        const result = await db.get(params).promise();
        return !!result.Item;  // Returns true if an item exists, false otherwise
    } catch (err) {
        console.error("Error checking email:", err);
        return false;  // Default to false on error
    }
}

async function createUser(email: string, firstName: string, lastName: string, password: string): Promise<User | string> {
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
router.post("/auth/create-user", async (req, res) => {
    const { email, firstName, lastName, password } = req.body;

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
            [USERS_PRIMARY_KEY]: email,  // Assuming USERS_PRIMARY_KEY is now set to "email"
        },
    };

    try {
        const result = await db.get(params).promise();
        const user = result.Item as User;

        if (!user) return false;

        // Compare the password with the hashed password
        const isPasswordValid = await comparePassword(password, user.hashedPassword);
        if (!isPasswordValid) return false;

        return user;
    } catch (err) {
        console.error("Error during sign-in:", err);
        return false;
    }
}

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

router.get("/:userId", async (req, res) => {
    const { userId } = req.params;
    const user = await getUser(userId);
    if (!user) {
        return res.status(404).send("User not found");
    }
    res.status(200).send(user);
});

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

router.post("/friend-request/deny", async (req, res) => {
    const { requesterId, requestId } = req.body;
    const result = await denyFriendRequest(requesterId, requestId);
    if (!result) {
        return res.status(404).send("Friend request denial unable to be processed");
    }
    res.status(200).send(result);
});

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

router.post("/unblock-user", async (req, res) => {
    const { unblockerId, blockedUserId } = req.body;
    const result = await unblockUser(unblockerId, blockedUserId);
    if (!result) {
        return res.status(404).send("Unblocking user not found");
    }
    res.status(200).send(result);
});

export default router;