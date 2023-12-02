import express from "express";
import axios from "axios";
import { DynamoDB, S3 } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import bcrypt from "bcrypt";
import { Event, User, Metric } from "./models";
import {
  EVENTS_TABLE_NAME,
  EVENTS_PRIMARY_KEY,
  USERS_TABLE_NAME,
  USERS_PRIMARY_KEY,
  EVENT_PIC_BUCKET,
  PRESIGNED_URL_EXPIRATION_SECONDS,
  EVENT_PIC_BUCKET_URI,
  METRICS_TABLE_NAME,
  METRICS_PRIMARY_KEY,
} from "./constants";
import { json } from "express";
import { getUser } from "./users";

// db set-up
const db = new DynamoDB.DocumentClient();
// S3 set-up
const s3 = new S3();
const router = express.Router();

router.get("/get-metrics", async (req, res) => {
  const params = {
    TableName: METRICS_TABLE_NAME,
  };

  var metrics: Metric[];

  try {
    const result = await db.scan(params).promise();
    metrics = result.Items as Metric[];
  } catch (err) {
    console.error("Error getting events:", err);
    return res.status(400).send("Error getting metrics");
  }

  var result: Metric;
  // epsilon-greedy
  if (Math.random() < 0.1) {
    result = metrics[Math.floor(Math.random() * metrics.length)];
  } else {
    result = metrics.reduce((prev, curr) => {
      return (prev.numActions / prev.numUsers) > (curr.numActions / curr.numUsers) ? prev : curr;
    });
  }

  const metricsParams = {
    TableName: METRICS_TABLE_NAME,
    Key: {
      [METRICS_PRIMARY_KEY]: result.metricsId,
    },
    UpdateExpression: "SET numUsers = numUsers + :increment",
    ExpressionAttributeValues: {
      ":increment": 1,
    },
  };

  try {
    await db.update(metricsParams).promise();
    res.status(200).send(result);
    // return event;
  } catch (err) {
    console.error("Error getting events:", err);
    return res.status(400).send("Error getting metrics");
  }
});

export async function createEvent(event: Event, metricsId: string): Promise<string | User> {
  if (!event.time || !event.location || !event.postingUserId) {
    return "Required event fields are missing";
  }

  const metricsParams = {
    TableName: METRICS_TABLE_NAME,
    Key: {
      [METRICS_PRIMARY_KEY]: metricsId,
    },
    UpdateExpression: "SET numActions = numActions + :increment",
    ExpressionAttributeValues: {
      ":increment": 1,
    },
  };

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
    await db.update(metricsParams).promise();
    return user;
    // return event;
  } catch (err) {
    console.error("Error creating event:", err);
    return "Error creating event";
  }
}

router.post("/event/create", async (req, res) => {
  const event: Event = {
    eventId: uuidv4(),
    title: req.body.title,
    description: req.body.description,
    date: req.body.date,
    time: req.body.time,
    location: req.body.location,
    postingUserId: req.body.postingUserId,
    blockedUsers: [],
    whoIsGoing: [req.body.postingUserId],
    // eventPictureUrl: req.body.eventPictureUrl,
    eventPictureUrl: `${EVENT_PIC_BUCKET_URI}default_event_picture.jpg`,
    tags: req.body.tags,
  };

  const user = await getUser(event.postingUserId);
  event.blockedUsers = user.blockedUsers;

  const result = await createEvent(event, req.body.metricsId);
  if (typeof result === "string") {
    return res.status(400).send(result);
  }

  // create dictionary of result object and event object
  const mergedObject: { user: User; event: Event } = {
    user: result,
    event: event,
  };

  res.status(201).send(mergedObject);
});

// TODO: TO BE USED FOR THE /EVENTS ENDPOINT -- AKSHAY use this to filter events by distance (need to grab their current coordinates)
type Coordinates = {
  latitude: number;
  longitude: number;
};

function calculateDistance(
  location1: Coordinates,
  location2: Coordinates,
  unit: "km" | "mi"
): number {
  const earthRadius = {
    km: 6371,
    mi: 3959,
  };

  const dLat = degreesToRadians(location2.latitude - location1.latitude);
  const dLon = degreesToRadians(location2.longitude - location1.longitude);

  const lat1 = degreesToRadians(location1.latitude);
  const lat2 = degreesToRadians(location2.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius[unit] * c;
}

// Helper function to convert degrees to radians
function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Example usage:
const location1: Coordinates = { latitude: 52.516275, longitude: 13.377704 };
const location2: Coordinates = { latitude: 48.856614, longitude: 2.352222 };

const distanceInKm = calculateDistance(location1, location2, "km");
console.log(`Distance in kilometers: ${distanceInKm}`);

const distanceInMi = calculateDistance(location1, location2, "mi");
console.log(`Distance in miles: ${distanceInMi}`);

async function getCoordinates(addr: string): Promise<Coordinates> {
  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address: addr,
          key: "AIzaSyDGt0z0i_LAEYqmz72przW0vrdKmxojtbg",
        },
      }
    );

    const results = response.data.results;
    if (results.length > 0) {
      const location = results[0].geometry.location;
      const latitude = location.lat;
      const longitude = location.lng;
      return { latitude, longitude };
    } else {
      throw new Error("No results found");
    }
  } catch (error) {
    console.error("Error retrieving coordinates:", error.message);
    throw error;
  }
}

export async function getEvents(): Promise<Event[]> {
  // area: string,
  // userLocation: string,
  // distance: number,
  // user: User
  const params = {
    TableName: EVENTS_TABLE_NAME,
    // FilterExpression:
    //   "area = :area AND poster <> :userId AND NOT contains (blockedUsers, :userId)",
    // ExpressionAttributeValues: {
    //   ":area": area,
    //   ":userId": user.userId,
    // },
  };

  try {
    const result = await db.scan(params).promise();
    return result.Items as Event[];
  } catch (err) {
    console.error("Error getting events:", err);
    return [];
  }
}

router.get("/events/:userId", async (req, res) => {
  const { userId } = req.params;
  const user = await getUser(userId);
  if (!user) {
    return res.status(404).send("User not found");
  }

  const events = await getEvents();

  const eventPromises = events
    .filter((event) => {
      if (event.postingUserId == user.userId) {
        return false;
      }
      return true;
    })
    .map(async (event) => {
      try {
        const event_coords = await getCoordinates(event.location);
        const user_coords = await getCoordinates(user.primaryLocation);
        const distance = calculateDistance(event_coords, user_coords, "mi");
        return { event, distance };
      } catch (error) {
        console.error("Error getting event coordinates:", error.message);
        return { event, distance: Infinity };
      }
    });

  const sortedEvents = await Promise.all(eventPromises);
  sortedEvents.sort((a, b) => a.distance - b.distance);
  const sortedEventItems = sortedEvents.map((item) => item.event);

  // area as string,
  // userLocation as string,
  // parseInt(distance as string),
  // user
  res.status(200).send(sortedEventItems);
});

export async function getEvent(eventId: string): Promise<Event | null> {
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

router.get("/event/:eventId", async (req, res) => {
  const { eventId } = req.params;
  const event = await getEvent(eventId);
  if (!event) {
    return res.status(404).send("Event not found");
  }
  res.status(200).send(event);
});

router.get("/events-going-to/:userId", async (req, res) => {
  const { userId } = req.params;
  const user: User | null = await getUser(userId);

  if (!user) {
    return res.status(404).send("User does not exist");
  }

  const results = await Promise.all(user.eventsGoingTo.map(async (eventId) => {
    // do something async with item
    return await getEvent(eventId);
  }));

  // const events: Event[] = [];
  // user.eventsGoingTo.forEach(async (eventId) => {
  //   const event = await getEvent(eventId);

  //   events.push(event);
  //   // if (event) {
  //   //   events.push(event);
  //   // }
  // });

  res.status(200).send(results);
});

router.get("/events-going-to-ids/:userId", async (req, res) => {
  const { userId } = req.params;
  const user: User | null = await getUser(userId);

  if (!user) {
    return res.status(404).send("User does not exist");
  }

  res.status(200).send(user.eventsGoingTo);
});

export async function updateEvent(event: Event): Promise<Event | null> {
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

router.post("/update-event", async (req, res) => {
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

router.get("/who-is-going", async (req, res) => {
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

router.get("/who-is-going-ids", async (req, res) => {
  const { eventId } = req.body;
  const event = await getEvent(eventId);

  if (!event) {
    return res.status(404).send("Event does not exist");
  }

  res.status(200).send(event.whoIsGoing);
});

export async function goingToEvent(
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

router.post("/going-to-event", async (req, res) => {
  const { userId, eventId } = req.body;
  const result = await goingToEvent(userId, eventId);
  if (result) {
    return res.status(404).send(result);
  }
  res.status(200).send(`User ${userId} going to event ${eventId}`);
});

export async function cancelGoingToEvent(
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

router.post("/cancel-going-to-event", async (req, res) => {
  const { userId, eventId } = req.body;
  const result = await cancelGoingToEvent(userId, eventId);
  if (result) {
    return res.status(404).send(result);
  }
  res.status(200).send(`User ${userId} no longer going to event ${eventId}`);
});

// async function getUser(userId: string): Promise<User | null> {
//   const params = {
//     TableName: USERS_TABLE_NAME,
//     Key: {
//       [USERS_PRIMARY_KEY]: userId,
//     },
//   };

//   try {
//     const result = await db.get(params).promise();
//     return result.Item as User;
//   } catch (err) {
//     console.error("Error getting user:", err);
//     return null;
//   }
// }

// event picture bucket read/write
export const getEventPicUploadURL = async function () {
  const randomID = uuidv4();
  const Key = `${randomID}.jpg`;

  // Get signed URL from S3
  const s3Params = {
    Bucket: EVENT_PIC_BUCKET,
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

export async function updateEventPicture(event: Event): Promise<Event | null> {
  const params = {
    TableName: EVENTS_TABLE_NAME,
    Key: {
      [EVENTS_PRIMARY_KEY]: event.eventId,
    },
    UpdateExpression: "SET eventPictureUrl = :eventPictureUrl",
    ExpressionAttributeValues: {
      ":eventPictureUrl": `${EVENT_PIC_BUCKET_URI}${event.eventPictureUrl}`,
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

router.get("/event-pic-presigned/:eventId", async (req, res) => {
  const { eventId } = req.params;
  const event = await getEvent(eventId);
  if (!event) {
    return res.status(404).send("Event not found");
  }

  const url = await getEventPicUploadURL();

  event.eventPictureUrl = JSON.parse(url).Key;
  const updateResult = await updateEventPicture(event);
  if (!updateResult) {
    return res.status(400).send("Error updating event's s3 URL");
  }
  return res.status(200).send(url);
});

router.get("/event-pic-as-bytes", async (req, res) => {
  const params = {
    Bucket: EVENT_PIC_BUCKET,
    Key: req.body.Key,
  };

  try {
    const data = await s3.getObject(params).promise();
    return res.status(200).send({ body: data.Body });
  } catch (err) {
    return res.send(err);
  }
});

// Function to delete an event from the database, along with all references in attendees' lists of events they are going to.
export async function deleteEvent(eventId: string): Promise<string> {
  const eventToDelete: Event | null = await getEvent(eventId);

  if (!eventToDelete) {
    return "Event not found";
  }

  // Remove the event from each attendee's list of events they are going to
  const attendeesUpdatePromises = eventToDelete.whoIsGoing.map((attendeeId) =>
    updateUserEventsList(attendeeId, eventId)
  );

  // Wait for all updates to be processed
  await Promise.all(attendeesUpdatePromises);

  // Finally, delete the event
  const deleteParams = {
    TableName: EVENTS_TABLE_NAME,
    Key: {
      eventId: eventId,
    },
  };

  try {
    await db.delete(deleteParams).promise();
    return "Event successfully deleted";
  } catch (err) {
    console.error("Error deleting event:", err);
    return "Error deleting event";
  }
}

// Helper function to update a user's list of events they are going to
export async function updateUserEventsList(
  userId: string,
  eventIdToRemove: string
): Promise<void> {
  const user: User | null = await getUser(userId);
  if (user) {
    const index = user.eventsGoingTo.indexOf(eventIdToRemove);
    if (index > -1) {
      user.eventsGoingTo.splice(index, 1);
      const updateParams = {
        TableName: USERS_TABLE_NAME,
        Key: {
          [USERS_PRIMARY_KEY]: userId,
        },
        UpdateExpression: "SET eventsGoingTo = :eventsGoingTo",
        ExpressionAttributeValues: {
          ":eventsGoingTo": user.eventsGoingTo,
        },
      };
      await db.update(updateParams).promise();
    }
  }
}

router.delete("/event/:eventId", async (req, res) => {
  const { eventId } = req.params;
  const result = await deleteEvent(eventId);
  if (result !== "Event successfully deleted") {
    return res.status(400).send(result);
  }
  res.status(200).send(result);
});

export default router;


