import { Options } from "swagger-jsdoc";

const definition = {
  openapi: '3.0.0',
  info: {
    title: 'User Event Management API',
    version: '1.0.0',
    description: 'API for managing users and events',
  },
  servers: [
    {
      url: 'http://localhost:3000/',
      description: 'Local server with user prefix',
    },
  ],
  paths: {
    'users/sanity-check': {
      get: {
        summary: 'Sanity Check',
        description: 'Check if the service is healthy',
        responses: {
          '200': {
            description: 'Healthy',
          },
        },
      },
    },
    'users/auth/create-user': {
      post: {
        summary: 'Create a new user',
        description: 'Registers a new user in the system',
        operationId: 'createUser',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/User',
              },
            },
          },
          required: true,
        },
        responses: {
          '201': {
            description: 'User created',
          },
          '400': {
            description: 'Invalid input',
          },
        },
      },
    },
    'users/auth/sign-in': {
      post: {
        summary: 'Sign in a user',
        description: 'Authenticates a user and returns their details',
        operationId: 'signIn',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Credentials',
              },
            },
          },
          required: true,
        },
        responses: {
          '200': {
            description: 'Successful operation',
          },
          '400': {
            description: 'Invalid credentials',
          },
        },
      },
    },
    'users/update-user': {
      post: {
        summary: 'Update an existing user',
        description: 'Updates an existing user in the system',
        operationId: 'updateUser',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/User',
              },
            },
          },
          required: true,
        },
        responses: {
          '200': {
            description: 'User updated',
          },
          '400': {
            description: 'Invalid input',
          },
          '404': {
            description: 'User not found',
          },
        },
      },
    },
    'users/friend-request': {
      post: {
        summary: 'Send a friend request',
        description: 'Sends a friend request from one user to another',
        operationId: 'sendFriendRequest',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/FriendRequest',
              },
            },
          },
          required: true,
        },
        responses: {
          '200': {
            description: 'Friend request sent',
          },
          '404': {
            description: 'Friend request unable to be processed',
          },
        },
      },
    },'/users/get-friends-of-user': {
      get: {
        summary: 'Get friends of a user',
        description: 'Returns a list of friends for a given user',
        operationId: 'getFriendsOfUser',
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: 'User ID to fetch friends for',
            required: true,
            schema: {
              $ref: '#/components/schemas/UserId',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Successful operation',
          },
          '404': {
            description: 'User not found',
          },
        },
      },
    },
    '/users/get-friends-of-user-ids': {
      get: {
        summary: 'Get friends IDs of a user',
        description: 'Returns a list of friends IDs for a given user',
        operationId: 'getFriendsOfUserIds',
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: 'User ID to fetch friends IDs for',
            required: true,
            schema: {
              $ref: '#/components/schemas/UserId',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Successful operation',
          },
          '404': {
            description: 'User not found',
          },
        },
      },
    },
    '/users/block-user': {
      post: {
        summary: 'Block a user',
        description: 'Block a user from interacting or viewing certain content',
        operationId: 'blockUser',
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: 'IDs of blocker and blocked user',
            required: true,
            schema: {
              $ref: '#/components/schemas/BlockUnblockRequest',
            },
          },
        ],
        responses: {
          '200': {
            description: 'User blocked',
          },
          '404': {
            description: 'Unable to block user',
          },
        },
      },
    },
    '/users/unblock-user': {
      post: {
        summary: 'Unblock a user',
        description: 'Unblock a user, allowing them to interact and view content again',
        operationId: 'unblockUser',
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: 'IDs of unblocker and blocked user',
            required: true,
            schema: {
              $ref: '#/components/schemas/BlockUnblockRequest',
            },
          },
        ],
        responses: {
          '200': {
            description: 'User unblocked',
          },
          '404': {
            description: 'Unable to unblock user',
          },
        },
      },
    },
    '/users/profile-pic-presigned': {
      get: {
        summary: 'Get presigned URL for profile picture upload',
        description: 'Returns a presigned URL for uploading profile picture to S3',
        operationId: 'getProfilePicUploadURL',
        produces: ['application/json'],
        responses: {
          '200': {
            description: 'Presigned URL generated',
          },
        },
      },
    },
    '/users/profile-pic-as-bytes': {
      get: {
        summary: 'Get profile picture as bytes',
        description: 'Returns the profile picture as bytes from the S3 bucket',
        operationId: 'getProfilePicAsBytes',
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: 'Key of the profile picture in S3 bucket',
            required: true,
            schema: {
              $ref: '#/components/schemas/ProfilePicKey',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Profile picture fetched',
          },
          '400': {
            description: 'Error fetching profile picture',
          },
        },
      },
    },
    '/users/{userId}': {
      get: {
        summary: 'Get user by ID',
        description: 'Returns a single user based on their ID',
        operationId: 'getUserById',
        produces: ['application/json'],
        parameters: [
          {
            in: 'path',
            name: 'userId',
            required: true,
            description: 'ID of the user to return',
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Successful operation',
          },
          '404': {
            description: 'User not found',
          },
        },
      },
    },
    '/users/auth/logout': {
      post: {
        summary: 'Logout a user',
        description: 'Invalidates user session or token',
        operationId: 'logoutUser',
        responses: {
          '200': {
            description: 'Logout successful',
          },
        },
      },
    },
    '/users/friends/mutual/{userId1}/{userId2}': {
      get: {
        summary: 'Get mutual friends between two users',
        description: 'Returns a list of mutual friends between user1 and user2',
        operationId: 'getMutualFriends',
        produces: ['application/json'],
        parameters: [
          {
            in: 'path',
            name: 'userId1',
            required: true,
            description: 'ID of the first user',
            schema: {
              type: 'string',
            },
          },
          {
            in: 'path',
            name: 'userId2',
            required: true,
            description: 'ID of the second user',
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '200': {
            description: 'List of mutual friends returned',
          },
          '404': {
            description: 'One or both users not found',
          },
          '500': {
            description: 'Error fetching mutual friends',
          },
        },
      },
    },
    '/users/events/mark-as-seen/{userId}/{eventId}': {
      post: {
        summary: 'Mark an event as seen by a user',
        description: 'Marks an event as seen for the user',
        operationId: 'markEventAsSeen',
        parameters: [
          {
            in: 'path',
            name: 'userId',
            required: true,
            description: 'ID of the user',
            schema: {
              type: 'string',
            },
          },
          {
            in: 'path',
            name: 'eventId',
            required: true,
            description: 'ID of the event to mark as seen',
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Event marked as seen',
          },
          '404': {
            description: 'User or event not found',
          },
          '500': {
            description: 'Error marking event as seen',
          },
        },
      },
    },
    '/users/events/save/{userId}/{eventId}': {
      post: {
        summary: 'Save an event to a user\'s profile',
        description: 'Saves an event to the user\'s profile for later viewing',
        operationId: 'saveEventToUserProfile',
        parameters: [
          {
            in: 'path',
            name: 'userId',
            required: true,
            description: 'ID of the user',
            schema: {
              type: 'string',
            },
          },
          {
            in: 'path',
            name: 'eventId',
            required: true,
            description: 'ID of the event to save',
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Event saved to profile',
          },
          '404': {
            description: 'User or event not found',
          },
          '500': {
            description: 'Error saving event to profile',
          },
        },
      },
    },
    '/events/event/create': {
      post: {
        summary: 'Create an event',
        description: 'Creates a new event and registers it under the posting user\'s profile',
        operationId: 'createEvent',
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: 'Event object that needs to be added to the store',
            required: true,
            schema: {
              $ref: '#/components/schemas/Event',
            },
          },
        ],
        responses: {
          '201': {
            description: 'Event created',
          },
          '400': {
            description: 'Invalid input',
          },
        },
      },
    },
    '/events/events': {
      get: {
        summary: 'Get list of events',
        description: 'Returns a list of all events from the database',
        operationId: 'getEvents',
        produces: ['application/json'],
        responses: {
          '200': {
            description: 'A list of events',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Event',
                  },
                },
              },
            },
          },
        },
      },
    },
    '/events/event/:eventId': {
      get: {
        summary: 'Get event by ID',
        description: 'Returns a single event based on the event ID',
        operationId: 'getEventById',
        produces: ['application/json'],
        parameters: [
          {
            in: 'path',
            name: 'eventId',
            required: true,
            description: 'ID of the event to return',
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Event',
                },
              },
            },
          },
          '404': {
            description: 'Event not found',
          },
        },
      },
    },
    '/events/events-going-to': {
      get: {
        summary: 'Get events a user is going to',
        description: 'Returns a list of events that the user is attending',
        operationId: 'getEventsUserIsGoingTo',
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: 'User ID to fetch events for',
            required: true,
            schema: {
              $ref: '#/components/schemas/UserId',
            },
          },
        ],
        responses: {
          '200': {
            description: 'List of events user is going to',
          },
          '404': {
            description: 'User does not exist',
          },
        },
      },
    },
    '/events/events-going-to-ids': {
      get: {
        summary: 'Get event IDs a user is going to',
        description: 'Returns a list of event IDs that the user is attending',
        operationId: 'getEventIdsUserIsGoingTo',
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: 'User ID to fetch event IDs for',
            required: true,
            schema: {
              $ref: '#/components/schemas/UserId',
            },
          },
        ],
        responses: {
          '200': {
            description: 'List of event IDs user is going to',
          },
          '404': {
            description: 'User does not exist',
          },
        },
      },
    },
    '/events/update-event': {
      post: {
        summary: 'Update an existing event',
        description: 'Updates details of an event specified by event ID',
        operationId: 'updateEvent',
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: 'Event object that needs to be updated',
            required: true,
            schema: {
              $ref: '#/components/schemas/Event',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Event updated',
          },
          '400': {
            description: 'Invalid input',
          },
          '404': {
            description: 'Event not found',
          },
        },
      },
    },
    '/events/who-is-going': {
      get: {
        summary: 'Get users who are going to an event',
        description: 'Returns a list of users who are marked as going to the specified event',
        operationId: 'getUsersGoingToEvent',
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: 'Event ID to fetch users for',
            required: true,
            schema: {
              $ref: '#/components/schemas/EventId',
            },
          },
        ],
        responses: {
          '200': {
            description: 'List of users going to event',
          },
          '404': {
            description: 'Event does not exist',
          },
        },
      },
    },
    '/events/who-is-going-ids': {
      get: {
        summary: 'Get user IDs who are going to an event',
        description: 'Returns a list of user IDs who are marked as going to the specified event',
        operationId: 'getUserIdsGoingToEvent',
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: 'Event ID to fetch user IDs for',
            required: true,
            schema: {
              $ref: '#/components/schemas/EventId',
            },
          },
        ],
        responses: {
          '200': {
            description: 'List of user IDs going to event',
          },
          '404': {
            description: 'Event does not exist',
          },
        },
      },
    },
    '/events/going-to-event': {
      post: {
        summary: 'Mark attendance for an event',
        description: 'Marks a user as going to an event',
        operationId: 'goingToEvent',
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: 'User ID and Event ID to mark attendance',
            required: true,
            schema: {
              $ref: '#/components/schemas/GoingToEventRequest',
            },
          },
        ],
        responses: {
          '200': {
            description: 'User marked as going to event',
          },
          '404': {
            description: 'User or event not found',
          },
        },
      },
    },
    '/events/cancel-going-to-event': {
      post: {
        summary: 'Cancel attendance for an event',
        description: 'Marks a user as not going to an event they previously marked attendance for',
        operationId: 'cancelGoingToEvent',
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: 'User ID and Event ID to cancel attendance',
            required: true,
            schema: {
              $ref: '#/components/schemas/CancelGoingToEventRequest',
            },
          },
        ],
        responses: {
          '200': {
            description: 'User no longer going to event',
          },
          '404': {
            description: 'User or event not found or user was not marked as going',
          },
        },
      },
    },
    '/events/event-pic-presigned': {
      get: {
        summary: 'Get presigned URL for event picture upload',
        description: 'Returns a presigned URL for uploading an event picture to S3',
        operationId: 'getEventPicUploadURL',
        produces: ['application/json'],
        parameters: [
          {
            in: 'query',
            name: 'eventId',
            description: 'Event ID to get presigned URL for',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Presigned URL generated for event picture upload',
          },
          '404': {
            description: 'Event not found',
          },
          '400': {
            description: 'Error generating presigned URL',
          },
        },
      },
    },
    '/events/event-pic-as-bytes': {
      get: {
        summary: 'Get event picture as bytes',
        description: 'Returns the event picture as bytes from the S3 bucket',
        operationId: 'getEventPicAsBytes',
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'query',
            name: 'Key',
            description: 'Key of the event picture in S3 bucket',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Event picture fetched as bytes',
          },
          '400': {
            description: 'Error fetching event picture',
          },
        },
      },
    },
  },
  components: {
    schemas: {
      User: {
        type: 'object',
        required: [
          'email',
          'userId',
          'firstName',
          'lastName',
          'hashedPassword',
          'primaryLocation',
          'blockedUsers',
          'interests',
          'friends',
          'requests',
          'groups',
          'eventsSeen',
          'eventsSaved',
          'eventsOwned',
          'eventsGoingTo',
          'eventsNotGoingTo',
          'messages',
          'profilePictureUrl',
        ],
        properties: {
          email: { type: 'string' },
          userId: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          hashedPassword: { type: 'string' },
          primaryLocation: { type: 'string' },
          blockedUsers: {
            type: 'array',
            items: { type: 'string' },
          },
          interests: {
            type: 'array',
            items: { type: 'string' },
          },
          friends: {
            type: 'array',
            items: { type: 'string' },
          },
          requests: {
            type: 'object',
            properties: {
              outgoing: {
                type: 'array',
                items: { type: 'string' },
              },
              incoming: {
                type: 'array',
                items: { type: 'string' },
              },
            },
          },
          groups: {
            type: 'array',
            items: { type: 'string' },
          },
          eventsSeen: {
            type: 'array',
            items: { type: 'string' },
          },
          eventsSaved: {
            type: 'array',
            items: { type: 'string' },
          },
          eventsOwned: {
            type: 'array',
            items: { type: 'string' },
          },
          eventsGoingTo: {
            type: 'array',
            items: { type: 'string' },
          },
          eventsNotGoingTo: {
            type: 'array',
            items: { type: 'string' },
          },
          messages: {
            type: 'array',
            items: { type: 'string' },
          },
          profilePictureUrl: { type: 'string' },
        },
      },
      Event: {
        type: 'object',
        required: [
          'eventId',
          'title',
          'description',
          'time',
          'location',
          'postingUserId',
          'blockedUsers',
          'photo',
          'whoIsGoing',
        ],
        properties: {
          eventId: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          time: { type: 'string' },
          location: { type: 'string' },
          postingUserId: { type: 'string' },
          blockedUsers: {
            type: 'array',
            items: { type: 'string' },
          },
          photo: { type: 'string' },
          whoIsGoing: {
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
      Credentials: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string' },
          password: { type: 'string' },
        },
      },
      FriendRequest: {
        type: 'object',
        required: ['requesterId', 'requestId'],
        properties: {
          requesterId: { type: 'string' },
          requestId: { type: 'string' },
        },
      },
      UserId: {
        type: 'object',
        required: ['userId'],
        properties: {
          userId: { type: 'string' },
        },
      },
      BlockUnblockRequest: {
        type: 'object',
        required: ['blockerId', 'blockedUserId'],
        properties: {
          blockerId: { type: 'string' },
          blockedUserId: { type: 'string' },
        },
      },
      ProfilePicKey: {
        type: 'object',
        required: ['Key'],
        properties: {
          Key: { type: 'string' },
        },
      },
      CancelGoingToEventRequest: {
        type: 'object',
        required: ['userId', 'eventId'],
        properties: {
          userId: { type: 'string' },
          eventId: { type: 'string' },
        },
      },
    },
  },
};

const options: Options = {
  definition,
  apis: ['../src/**/*.ts'],
};

export default options;
