import { User } from '../src/models';

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