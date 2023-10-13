import express from "express";
import { DynamoDB } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

const USERS_TABLE_NAME = process.env.USERS_TABLE_NAME || "";
const USERS_PRIMARY_KEY = process.env.USERS_PRIMARY_KEY || "";
const EVENTS_TABLE_NAME = process.env.EVENTS_TABLE_NAME || "";
const EVENTS_PRIMARY_KEY = process.env.EVENTS_PRIMARY_KEY || "";

const db = new DynamoDB.DocumentClient();

const app = express();
const port = 80;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

type User = {
    userId: string;
    primaryLocation: string;
    blockedUsers: string[];
    name: string;
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
    time: string;
    location: string;
    poster: string;
    blockedUsers: string[];
    photo: string;
    whoIsGoing: string[];
};

async function createUser(user: User): Promise<User | string> {
    if (!user.name || !user.primaryLocation || !user.profilePictureUrl) {
        return "Required user fields are missing";
    }

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

async function createEvent(event: Event): Promise<Event | string> {
    if (!event.time || !event.location || !event.poster || !event.photo) {
        return "Required event fields are missing";
    }

    const params = {
        TableName: EVENTS_TABLE_NAME,
        Item: event,
    };

    try {
        await db.put(params).promise();
        return event;
    } catch (err) {
        console.error("Error creating event:", err);
        return "Error creating event";
    }
}

app.post("/user/create", async (req, res) => {
    const user: User = {
        userId: uuidv4(),
        primaryLocation: req.body.primaryLocation,
        blockedUsers: [],
        name: req.body.name,
        interests: req.body.interests || [],
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
        profilePictureUrl: req.body.profilePictureUrl,
    };

    const result = await createUser(user);
    if (typeof result === "string") {
        return res.status(400).send(result);
    }

    res.status(201).send(result);
});

app.post("/event/create", async (req, res) => {
    const event: Event = {
        eventId: uuidv4(),
        time: req.body.time,
        location: req.body.location,
        poster: req.body.poster,
        blockedUsers: [],
        photo: req.body.photo,
        whoIsGoing: [],
    };

    const result = await createEvent(event);
    if (typeof result === "string") {
        return res.status(400).send(result);
    }

    res.status(201).send(result);
});

async function getUser(userId: string): Promise<User | null> {
    // Logic to fetch a user by their ID.
    // Example: Fetch user from a database.

    const allUsers: User[] = []; // Assume this is fetched from a database.

    return allUsers.find(user => user.userId === userId) || null;
}


async function getEvents(area: string, userLocation: string, distance: number, user: User): Promise<Event[]> {
    // Logic to fetch events based on the provided parameters.
    // Ensure to filter out events created by the user and from blocked users.
    // For simplicity, this function does not actually fetch data from a database.

    // Example: Fetch events from a database and filter them based on the criteria.
    const allEvents: Event[] = []; // Assume this is fetched from a database.

    return allEvents.filter(event =>
        event.poster !== user.userId &&
        !event.blockedUsers.includes(user.userId) &&
        // Add logic to filter events based on `area`, `userLocation`, and `distance`.
        // For simplicity, this function does not actually filter events.
        true
    );
}

// Additional endpoints and functions will go here...
app.get("/events", async (req, res) => {
    const { area, userLocation, distance, userId } = req.query;
    const user = await getUser(userId);
    if (!user) {
        return res.status(404).send("User not found");
    }
    const events = await getEvents(area, userLocation, distance, user);
    res.status(200).send(events);
});

async function getEvent(eventId: string): Promise<Event | null> {
    // Logic to fetch a single event by its ID.
    // Example: Fetch event from a database.

    const allEvents: Event[] = []; // Assume this is fetched from a database.

    return allEvents.find(event => event.eventId === eventId) || null;
}

app.get("/event/:eventId", async (req, res) => {
    const { eventId } = req.params;
    const event = await getEvent(eventId);
    if (!event) {
        return res.status(404).send("Event not found");
    }
    res.status(200).send(event);
});

async function sendFriendRequest(requesterId: string, requestId: string): Promise<string> {
    // Logic to send a friend request from requester to requestee.
    // Example: Update user data in a database.

    // Fetch users from a database.
    const requester: User | null = await getUser(requesterId);
    const requestee: User | null = await getUser(requestId);

    if (!requester || !requestee) {
        return "User not found";
    }

    // Add logic to update `requests` in the database.
    requester.requests.outgoing.push(requestId);
    requestee.requests.incoming.push(requesterId);

    // Save updated users back to the database.

    return "Friend request sent";
}


app.post("/friend-request", async (req, res) => {
    const { requesterId, requestId } = req.body;
    const result = await sendFriendRequest(requesterId, requestId);
    res.status(200).send(result);
});

async function blockUser(blockerId: string, blockedUserId: string): Promise<string> {
    // Logic to block a user.
    // Example: Update user data in a database.

    const blocker: User | null = await getUser(blockerId);

    if (!blocker) {
        return "User not found";
    }

    // Add logic to update `blockedUsers` in the database.
    blocker.blockedUsers.push(blockedUserId);

    // Save updated user back to the database.

    return "User blocked";
}

app.post("/block-user", async (req, res) => {
    const { blockerId, blockedUserId } = req.body;
    const result = await blockUser(blockerId, blockedUserId);
    res.status(200).send(result);
});

async function goingToEvent(userId: string, eventId: string): Promise<string> {
    // Logic to mark a user as going to an event and update the event's attendees.
    // Example: Update user and event data in a database.

    const user: User | null = await getUser(userId);
    const event: Event | null = await getEvent(eventId);

    if (!user || !event) {
        return "User or Event not found";
    }

    // Add logic to update `eventsGoingTo` and `whoIsGoing` in the database.
    user.eventsGoingTo.push(eventId);
    event.whoIsGoing.push(userId);

    // Save updated user and event back to the database.

    return "Marked as going to the event";
}


app.post("/going-to-event", async (req, res) => {
    const { userId, eventId } = req.body;
    const result = await goingToEvent(userId, eventId);
    res.status(200).send(result);
});

// Add more API endpoints as per your requirements.

app.get("/posts", (req, res) => {
    res.status(200).send("posts API");
});

app.get("/", (req, res) => {
    res
        .status(200)
        .send(
            "Hello Serverless APIGW with Application Load-Balanced Fargate Service!"
        );
});

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});



