// schema
export interface User {
  email: string;
  userId: string;
  firstName: string;
  lastName: string;
  age?: number;
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
}

export interface Event {
  eventId: string;
  title: string;
  description: string;
  time: string;
  location: string;
  postingUserId: string;
  blockedUsers: string[];
  whoIsGoing: string[];
  eventPictureUrl: string;
}

export interface GroupChat {
  groupId: string;
  name: string;
  event_id: string;
  user_ids: string[];
}

export interface Message {
  messageId: string;
  groupId: string;
  userId: string;
  content: string;
  timestamp: string;
}
