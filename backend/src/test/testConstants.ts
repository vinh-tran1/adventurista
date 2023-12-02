import { User, Event, Message, GroupChat } from '../src/models';
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
  profilePictureUrl: "default_profile_picture.jpg",
  bio: "",
  bannerImageUrl: "default_banner_image.jpg",
  age: 0,
};

export const sampleUserFriendsTesting: User = {
  email: sampleEmail,
  userId: sampleUserId,
  firstName: sampleFirstName,
  lastName: sampleLastName,
  hashedPassword: sampleUnhashedPassword,
  primaryLocation: "",
  blockedUsers: ["blockedUserId"],
  interests: [],
  friends: [],
  requests: {
    outgoing: ["notARealUserId"],
    incoming: ["alsoNotARealUserId"],
  },
  groups: [],
  eventsSeen: [],
  eventsSaved: [],
  eventsOwned: [],
  eventsGoingTo: [],
  eventsNotGoingTo: [],
  messages: [],
  profilePictureUrl: "default_profile_picture.jpg",
  bio: "",
  bannerImageUrl: "default_banner_image.jpg",
  age: 0,
};

export const sampleUserNotBlockedTesting: User = {
  email: sampleEmail,
  userId: sampleUserId,
  firstName: sampleFirstName,
  lastName: sampleLastName,
  hashedPassword: sampleUnhashedPassword,
  primaryLocation: "",
  blockedUsers: ["fakeUserId"],
  interests: [],
  friends: [],
  requests: {
    outgoing: ["notARealUserId"],
    incoming: ["alsoNotARealUserId"],
  },
  groups: [],
  eventsSeen: [],
  eventsSaved: [],
  eventsOwned: [],
  eventsGoingTo: [],
  eventsNotGoingTo: [],
  messages: [],
  profilePictureUrl: "default_profile_picture.jpg",
  bio: "",
  bannerImageUrl: "default_banner_image.jpg",
  age: 0,
};

export const sampleUpdatedUser: User = {
  email: sampleEmail,
  userId: sampleUserId,
  firstName: sampleFirstName,
  lastName: sampleLastName,
  hashedPassword: sampleUnhashedPassword,
  primaryLocation: "Seattle, WA",
  blockedUsers: [],
  interests: [],
  friends: ["requesterUserId", "requesteeUserId"],
  requests: {
    outgoing: ["requesterUserId", "requesteeUserId"],
    incoming: ["requesterUserId", "requesteeUserId"],
  },
  groups: [],
  eventsSeen: [],
  eventsSaved: [],
  eventsOwned: [],
  eventsGoingTo: [],
  eventsNotGoingTo: [],
  messages: [],
  profilePictureUrl: "default_profile_picture.jpg",
  bio: "Hi I have updated my parameters",
  bannerImageUrl: "default_banner_image.jpg",
  age: 22,
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

export const sampleMessage: Message = {
  messageId: "messageId",
  groupId: "groupId",
  userId: "userId",
  content: "some message",
  timestamp: "2021-05-01T00:00:00.000Z",
}

export const sampleGroupChat: GroupChat = {
  groupId: "groupId",
  name: "coolFunGroup",
  event_id: "eventId",
  user_ids: ["userId", "userId1", "userId2"],
};

