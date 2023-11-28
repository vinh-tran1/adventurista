import { User, Event } from '../src/models';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

export const sampleUserId: string = "testUserId"

export const sampleUser: User = {
    email: "test@test.edu",
    userId: sampleUserId,
    firstName: "Bob",
    lastName: "Joe",
    hashedPassword: "NotAPassword123",
    primaryLocation: "",
    blockedUsers: [],
    interests: [],
    friends: [],
    requests: {
      outgoing: [],
      incoming: [],
    },
    groups: [],
    eventsSeen: [],
    eventsSaved: [],
    eventsOwned: [],
    eventsGoingTo: [],
    eventsNotGoingTo: [],
    messages: [],
    profilePictureUrl: "",
    bio: "",
    bannerImageUrl: "",
    age: 0,
  };

  export const sampleEventId = "065c748f-3b89-4a4f-8d2b-9493f2d84e42"
  const date = moment().format('YYYY-MM-DD')

  export const sampleEvent: Event = {
    eventId: sampleEventId,
    title: 'Sample Event',
    description: 'This is a sample event',
    date: date,
    time: '18:00:00',
    location: 'Sample Location',
    postingUserId: sampleUserId,
    blockedUsers: [],
    whoIsGoing: [],
    eventPictureUrl: '',
    tags: []
  };

  export const newSampleEvent: Event = {
    eventId: sampleEventId,
    title: 'Sample Event',
    description: 'This is a sample event',
    date: date,
    time: '20:00:00',
    location: 'Sample Location',
    postingUserId: sampleUserId,
    blockedUsers: [],
    whoIsGoing: [],
    eventPictureUrl: '',
    tags: []
  };

