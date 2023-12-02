import express from "express";
import { DynamoDB } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import bcrypt from "bcrypt";

// keys
const USERS_TABLE_NAME = process.env.USERS_TABLE_NAME || "";
const USERS_PRIMARY_KEY = process.env.USERS_PRIMARY_KEY || "";
const EVENTS_TABLE_NAME = process.env.EVENTS_TABLE_NAME || "";
const EVENTS_PRIMARY_KEY = process.env.EVENTS_PRIMARY_KEY || "";

// db set-up
const db = new DynamoDB.DocumentClient();

const app = express();
const port = 80;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// schema
type User = {
  email: string;
  userId: string;
  firstName: string;
  lastName: string;
  hashedPassword: string;
  primaryLocation: string;
  blockedUsers: string[];
  interests: string[];
  friends: string[];
  requests: {
    outgoing: string[];
    incoming: string[];
  };
  groups: string[];
  eventsOwned: string[];
  eventsGoingTo: string[];
  eventsNotGoingTo: string[];
  messages: string[];
  profilePictureUrl: string;
};

type Event = {
  eventId: string;
  title: string;
  description: string;
  time: string;
  location: string;
  postingUserId: string;
  blockedUsers: string[];
  photo: string;
  whoIsGoing: string[];
};

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
app.post("/auth/create-user", async (req, res) => {
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


app.post("/auth/sign-in", async (req, res) => {
  const { email, password } = req.body;

  const user = await signIn(email, password);
  if (!user) {
      return res.status(400).send("Invalid credentials");
  }

  res.status(200).send(user);
});



async function createEvent(event: Event): Promise<Event | string> {
  if (!event.time || !event.location || !event.postingUserId) {
    return "Required event fields are missing";
  }

  const params = {
    TableName: EVENTS_TABLE_NAME,
    Item: event,
  };

  const user: User = await getUser(event.postingUserId);
  if (!user) {
    return "Posting user does not exist";
  }

  user.eventsOwned.push(event.eventId);
  user.eventsGoingTo.push(event.eventId);

  const userParams = {
    TableName: USERS_TABLE_NAME,
    Key: {
      [USERS_PRIMARY_KEY]: user.userId,
    },
    UpdateExpression:
      "SET eventsOwned = :eventsOwned, eventsGoingTo = :eventsGoingTo",
    ExpressionAttributeValues: {
      ":eventsOwned": user.eventsOwned,
      ":eventsGoingTo": user.eventsGoingTo,
    },
  };

  try {
    await db.put(params).promise();
    await db.update(userParams).promise();
    return event;
  } catch (err) {
    console.error("Error creating event:", err);
    return "Error creating event";
  }
}

app.post("/event/create", async (req, res) => {
  const event: Event = {
    eventId: uuidv4(),
    title: req.body.title,
    description: req.body.description,
    time: req.body.time,
    location: req.body.location,
    postingUserId: req.body.postingUserId,
    blockedUsers: [],
    photo: "",
    whoIsGoing: [req.body.postingUserId],
  };

  const user = await getUser(event.postingUserId);
  event.blockedUsers = user.blockedUsers;

  const result = await createEvent(event);
  if (typeof result === "string") {
    return res.status(400).send(result);
  }

  res.status(201).send(result);
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

app.post("/update-user", async (req, res) => {
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

async function updateEvent(event: Event): Promise<Event | null> {
  const params = {
    TableName: EVENTS_TABLE_NAME,
    Key: {
      [EVENTS_PRIMARY_KEY]: event.eventId,
    },
    UpdateExpression:
      "SET title = :title, description = :description, time = :time, location = :location",
    ExpressionAttributeValues: {
      ":title": event.title,
      ":description": event.description,
      ":time": event.time,
      ":location": event.location,
    },
  };

  try {
    await db.update(params).promise();
    return event;
  } catch (err) {
    console.error("Error updating event:", err);
    return null;
  }
}

app.post("/update-event", async (req, res) => {
  const event = await getEvent(req.body.eventId);
  if (!event) {
    return res.status(404).send("Event not found");
  }
  event.title = req.body.title;
  event.description = req.body.description;
  event.time = req.body.time;
  event.location = req.body.location;

  const result = updateEvent(event);
  if (!result) {
    return res.status(400).send("Error updating event");
  }

  res.status(200).send(result);
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

app.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  const user = await getUser(userId);
  if (!user) {
    return res.status(404).send("User not found");
  }
  res.status(200).send(user);
});

async function getEvents(
  area: string,
  userLocation: string,
  distance: number,
  user: User
): Promise<Event[]> {
  const params = {
    TableName: EVENTS_TABLE_NAME,
    FilterExpression:
      "area = :area AND poster <> :userId AND NOT contains (blockedUsers, :userId)",
    ExpressionAttributeValues: {
      ":area": area,
      ":userId": user.userId,
    },
  };

  try {
    const result = await db.scan(params).promise();
    return result.Items as Event[];
  } catch (err) {
    console.error("Error getting events:", err);
    return [];
  }
}

app.get("/events", async (req, res) => {
  const { area, userLocation, distance, userId } = req.query;
  const user = await getUser(userId as string);
  if (!user) {
    return res.status(404).send("User not found");
  }
  const events = await getEvents(
    area as string,
    userLocation as string,
    parseInt(distance as string),
    user
  );
  res.status(200).send(events);
});

async function getEvent(eventId: string): Promise<Event | null> {
  const params = {
    TableName: EVENTS_TABLE_NAME,
    Key: {
      [EVENTS_PRIMARY_KEY]: eventId,
    },
  };

  try {
    const result = await db.get(params).promise();
    return result.Item as Event;
  } catch (err) {
    console.error("Error getting event:", err);
    return null;
  }
}

app.get("/event/:eventId", async (req, res) => {
  const { eventId } = req.params;
  const event = await getEvent(eventId);
  if (!event) {
    return res.status(404).send("Event not found");
  }
  res.status(200).send(event);
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

app.post("/friend-request", async (req, res) => {
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

app.post("/friend-request/unadd", async (req, res) => {
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

app.post("/friend-request/accept", async (req, res) => {
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

app.post("/friend-request/deny", async (req, res) => {
  const { requesterId, requestId } = req.body;
  const result = await denyFriendRequest(requesterId, requestId);
  if (!result) {
    return res.status(404).send("Friend request denial unable to be processed");
  }
  res.status(200).send(result);
});

app.get("/get-friends-of-user", async (req, res) => {
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

app.get("/get-friends-of-user-ids", async (req, res) => {
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

app.post("/block-user", async (req, res) => {
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

app.post("/unblock-user", async (req, res) => {
  const { unblockerId, blockedUserId } = req.body;
  const result = await unblockUser(unblockerId, blockedUserId);
  if (!result) {
    return res.status(404).send("Unblocking user not found");
  }
  res.status(200).send(result);
});

app.get("/events-going-to", async (req, res) => {
  const { userId } = req.body;
  const user: User | null = await getUser(userId);

  if (!user) {
    return res.status(404).send("User does not exist");
  }

  const events: Event[] = [];
  user.eventsGoingTo.forEach(async (eventId) => {
    const event: Event | null = await getEvent(eventId);

    if (event) {
      events.push(event);
    }
  });

  res.status(200).send(events);
});

app.get("/events-going-to-ids", async (req, res) => {
  const { userId } = req.body;
  const user: User | null = await getUser(userId);

  if (!user) {
    return res.status(404).send("User does not exist");
  }

  res.status(200).send(user.eventsGoingTo);
});

app.get("/who-is-going", async (req, res) => {
  const { eventId } = req.body;
  const event = await getEvent(eventId);

  if (!event) {
    return res.status(404).send("Event does not exist");
  }

  const users: User[] = [];
  event.whoIsGoing.forEach(async (userId) => {
    const user: User | null = await getUser(userId);

    if (user) {
      users.push(user);
    }
  });

  res.status(200).send(users);
});

app.get("/who-is-going-ids", async (req, res) => {
  const { eventId } = req.body;
  const event = await getEvent(eventId);

  if (!event) {
    return res.status(404).send("Event does not exist");
  }

  res.status(200).send(event.whoIsGoing);
});

async function goingToEvent(
  userId: string,
  eventId: string
): Promise<string | null> {
  const user: User | null = await getUser(userId);
  const event: Event | null = await getEvent(eventId);

  if (!user || !event) {
    return "User or Event not found";
  }

  if (
    event.whoIsGoing.includes(userId) &&
    user.eventsGoingTo.includes(eventId)
  ) {
    return "User is already going to event";
  }

  // Add logic to update `eventsGoingTo` and `whoIsGoing` in the database.
  user.eventsGoingTo.push(eventId);
  event.whoIsGoing.push(userId);

  // Update events table
  const eventParams = {
    TableName: EVENTS_TABLE_NAME,
    Key: {
      [EVENTS_PRIMARY_KEY]: event.eventId,
    },
    UpdateExpression: "SET whoIsGoing = :whoIsGoing",
    ExpressionAttributeValues: {
      ":whoIsGoing": event.whoIsGoing,
    },
  };

  try {
    await db.update(eventParams).promise();
  } catch (err) {
    console.error("Error updating event:", err);
    return `Error updating event: ${err}`;
  }

  // Update users table
  const userParams = {
    TableName: USERS_TABLE_NAME,
    Key: {
      [USERS_PRIMARY_KEY]: user.userId,
    },
    UpdateExpression: "SET eventsGoingTo = :eventsGoingTo",
    ExpressionAttributeValues: {
      ":eventsGoingTo": user.eventsGoingTo,
    },
  };

  try {
    await db.update(userParams).promise();
  } catch (err) {
    console.error("Error updating event:", err);
    return `Error updating user: ${err}`;
  }
  return null;
}

app.post("/going-to-event", async (req, res) => {
  const { userId, eventId } = req.body;
  const result = await goingToEvent(userId, eventId);
  if (result) {
    return res.status(404).send(result);
  }
  res.status(200).send(`User ${userId} going to event ${eventId}`);
});

async function cancelGoingToEvent(
  userId: string,
  eventId: string
): Promise<string | null> {
  const user: User | null = await getUser(userId);
  const event: Event | null = await getEvent(eventId);

  if (!user || !event) {
    return "User or Event not found";
  }

  if (
    !event.whoIsGoing.includes(userId) ||
    !user.eventsGoingTo.includes(eventId)
  ) {
    return "User never marked attendance for event";
  }

  // Add logic to update `eventsGoingTo` and `whoIsGoing` in the database.
  const i = user.eventsGoingTo.indexOf(eventId);
  const j = event.whoIsGoing.indexOf(userId);
  user.eventsGoingTo.splice(i, 1);
  event.whoIsGoing.splice(j, 1);

  // Update events table
  const eventParams = {
    TableName: EVENTS_TABLE_NAME,
    Key: {
      [EVENTS_PRIMARY_KEY]: event.eventId,
    },
    UpdateExpression: "SET whoIsGoing = :whoIsGoing",
    ExpressionAttributeValues: {
      ":whoIsGoing": event.whoIsGoing,
    },
  };

  try {
    await db.update(eventParams).promise();
  } catch (err) {
    console.error("Error unmarking attendance from event:", err);
    return `Error unmarking attendance from event: ${err}`;
  }

  // Update users table
  const userParams = {
    TableName: USERS_TABLE_NAME,
    Key: {
      [USERS_PRIMARY_KEY]: user.userId,
    },
    UpdateExpression: "SET eventsGoingTo = :eventsGoingTo",
    ExpressionAttributeValues: {
      ":eventsGoingTo": user.eventsGoingTo,
    },
  };

  try {
    await db.update(userParams).promise();
  } catch (err) {
    console.error("Error unmarking attendance from event:", err);
    return `Error unmarking attendance from event: ${err}`;
  }
  return null;
}

app.post("/cancel-going-to-event", async (req, res) => {
  const { userId, eventId } = req.body;
  const result = await cancelGoingToEvent(userId, eventId);
  if (result) {
    return res.status(404).send(result);
  }
  res.status(200).send(`User ${userId} no longer going to event ${eventId}`);
});

app.get("/posts", (req, res) => {
  res.status(200).send("posts API");
});

app.get("/", (req, res) => {
  res.status(200).send("Healthy!");
});

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
