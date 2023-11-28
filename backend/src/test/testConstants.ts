import { User, Event } from '../src/models';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

export const sampleUserId: string = "testUserId"
export const sampleEmail: string = "test@test.edu"
export const sampleFirstName: string = "Bob"
export const sampleLastName: string = "Joe"
export const sampleUnhashedPassword: string = "NotAPassword123"

export const sampleUser: User = {
    email: sampleEmail,
    userId: sampleUserId,
    firstName: sampleFirstName,
    lastName: sampleLastName,
    hashedPassword: sampleUnhashedPassword,
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

  export const sampleEvent: Event = {
    eventId: uuidv4(),
    title: 'Sample Event',
    description: 'This is a sample event',
    date: moment().format('YYYY-MM-DD'),
    time: '18:00:00',
    location: 'Sample Location',
    postingUserId: sampleUserId,
    blockedUsers: [],
    whoIsGoing: [],
    eventPictureUrl: '',
    tags: []
  };

  export const sampleEventId = sampleEvent.eventId;