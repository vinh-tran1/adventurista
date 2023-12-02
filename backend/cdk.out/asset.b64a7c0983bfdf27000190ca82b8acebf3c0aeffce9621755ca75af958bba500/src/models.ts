// schema
export interface User {
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

export interface Event {
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

