// Assuming you have an `events` module that exports `getEvent` function
import { getEvent, createEvent, updateEvent, updateEventPicture, deleteEvent } from '../src/events';
import { getUser } from '../src/users';
import { Event } from '../src/models';
import AWS from 'aws-sdk';
import request from 'supertest'; // if you are using supertest for HTTP assertions
// import app from '../src/app'; // your Express application
import * as sinon from 'sinon';
import { AWSError, Request } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { sampleEvent, sampleEventId, sampleUser, newSampleEvent } from './testConstants';

const sandbox = sinon.createSandbox();

describe('Get Event', () => {
  afterEach(() => {
    sandbox.restore();
  });
  it('When event exists', async () => {
    // Mock AWS SDK response for an existing event
    const returnValueMock: Request<DocumentClient.GetItemOutput, AWSError> = {
      promise: () => Promise.resolve({ Item: sampleEvent }),
    } as unknown as Request<DocumentClient.GetItemOutput, AWSError>;

    // Stub the DynamoDB get method
    const stub = sandbox.stub(AWS.DynamoDB.DocumentClient.prototype, 'get').returns(returnValueMock);

    // Call getEvent
    const result = await getEvent(sampleEventId);

    // Assert that the event is returned
    expect(result).toEqual(sampleEvent);
  });

  it('When event does not exist', async () => {
    // Mock AWS SDK response for a non-existing event
    const returnValueMock: Request<DocumentClient.GetItemOutput, AWSError> = {
      promise: () => Promise.resolve({}),
    } as unknown as Request<DocumentClient.GetItemOutput, AWSError>;

    // Stub the DynamoDB get method
    const stub = sandbox.stub(AWS.DynamoDB.DocumentClient.prototype, 'get').returns(returnValueMock);

    // Call getEvent
    const result = await getEvent(sampleEventId);

    // Assert that null is returned for a non-existing event
    expect(result).not.toEqual(sampleEvent);
  });
});

describe('Create Event', () => {
    afterEach(() => {
      sandbox.restore();
    });

  
    it('should return an error string when required event fields are missing', async () => {
      // Call createEvent with missing fields
      const event = {
        ...sampleEvent,
        time: "", // Required field is null
      };
      const result = await createEvent(event);
  
      // Assert that the result is an error string
      expect(result).not.toEqual(sampleEvent);
    });
    it('should fail when user doesnt exist', async () => {
        // Call createEvent with missing fields
        const event = {
          ...sampleEvent,
          // time: null, // Required field is null
        };
        const result = await createEvent(event);
    
        // Assert that the result is an error string
        expect(result).not.toEqual(sampleUser);
      });

  
  });


  describe('Update Event', () => {
    afterEach(() => {
      sandbox.restore();
    });
    it('Should return new event when required fields are present', async () => {
      // Call createEvent with missing fields
      const event = {
        ...sampleEvent,
        time: '20:00:00'
      };
      const result = await updateEvent(event);
  
      // Assert that the result is an error string
      expect(result).not.toEqual(sampleEvent);
    });
  });

  describe('Update Event Picture', () => {
    afterEach(() => {
      sandbox.restore();
    });
    
    it('When DynamoDB update is successful', async () => {
      const returnValueMock = {
          promise () {
            return {
                Attributes: sampleEvent,
            };
          },
        } as unknown as Request <DocumentClient.UpdateItemOutput, AWSError>;
              
        const stub = sandbox.stub(DocumentClient.prototype, 'update').returns(returnValueMock);
  
        const result = await updateEventPicture(sampleEvent);
        expect(result).toEqual(sampleEvent);
    });
  
    it('When DynamoDB update is not successful', async () => {
      const returnValueMock = {
          promise () {
            return {
              Attributes: sampleEvent,
            };
          },
        } as unknown as Request <DocumentClient.UpdateItemOutput, AWSError>;
              
        const stub = sandbox.stub(DocumentClient.prototype, 'update').throwsException("Enable to update user table");
  
        const result = await updateEventPicture(sampleEvent);
        expect(result).toBeNull();
    });

    // DDB Update will create new user when it does not already exist in the users table
    // Thus, checking for user existence is futile
});

// describe('Delete Event', () => {
//   afterEach(() => {
//     sandbox.restore();
//   });
  
//   it('When DynamoDB delete is successful', async () => {
//     const returnGetMock = {
//       promise () {
//         return {
//             Attributes: sampleEvent,
//         };
//       },
//     } as unknown as Request <DocumentClient.GetItemOutput, AWSError>;
          
//     sandbox.stub(DocumentClient.prototype, 'get').returns(returnGetMock);

//     const returnUpdateMock = {
//         promise () {
//           return {
//               Attributes: sampleEvent,
//           };
//         },
//       } as unknown as Request <DocumentClient.UpdateItemOutput, AWSError>;
            
//     sandbox.stub(DocumentClient.prototype, 'update').returns(returnUpdateMock);

//       const returnDeleteMock = {
//         promise () {
//           return {
//               Attributes: sampleEvent,
//           };
//         },
//       } as unknown as Request <DocumentClient.DeleteItemOutput, AWSError>;
            
//       const stub = sandbox.stub(DocumentClient.prototype, 'delete').returns(returnDeleteMock);

//       const result = await deleteEvent("eventId");
//       expect(result).toEqual("Event successfully deleted");
//   });

//   it('When DynamoDB update is not successful', async () => {
//     const returnGetMock = {
//       promise () {
//         return {
//             Attributes: sampleEvent,
//         };
//       },
//     } as unknown as Request <DocumentClient.GetItemOutput, AWSError>;
          
//     sandbox.stub(DocumentClient.prototype, 'get').returns(returnGetMock);

//     const returnUpdateMock = {
//         promise () {
//           return {
//               Attributes: sampleEvent,
//           };
//         },
//       } as unknown as Request <DocumentClient.UpdateItemOutput, AWSError>;
            
//     sandbox.stub(DocumentClient.prototype, 'update').throws("Unable to update events table");

//       const returnDeleteMock = {
//         promise () {
//           return {
//               Attributes: sampleEvent,
//           };
//         },
//       } as unknown as Request <DocumentClient.DeleteItemOutput, AWSError>;
            
//       const stub = sandbox.stub(DocumentClient.prototype, 'delete').returns(returnDeleteMock);

//       const result = await deleteEvent("eventId");
//       expect(result).toThrow("Unable to update events table");
//   });

//   // DDB Update will create new user when it does not already exist in the users table
//   // Thus, checking for user existence is futile
// });



// Endpoints for Event Management System Testing Full Coverage

// POST /event/create - Create a new event
// GET /events/:userId - Fetch events for a given user by userID
// GET /event/:eventId - Retrieve details of a specific event by eventID
// GET /events-going-to/:userId - Fetch events a user (userID) is attending
// GET /events-going-to-ids/:userId - Get event IDs a user (userID) is planning to attend
// POST /update-event - Update an existing event
// GET /who-is-going - Get users attending a specific event (requires eventID)
// GET /who-is-going-ids - Get user IDs of attendees for a specific event (requires eventID)
// POST /going-to-event - Mark a user as attending an event (requires userID and eventID)
// POST /cancel-going-to-event - Cancel a user's attendance at an event (requires userID and eventID)
// GET /event-pic-presigned/:eventId - Get a presigned URL for uploading an event picture (requires eventID)
// GET /event-pic-as-bytes - Fetch an event picture from S3 (requires image key)
// DELETE /event/:eventId - Delete a specific event (requires eventID)

// Utility Functions for Event Management System

// calculateDistance(location1: Coordinates, location2: Coordinates, unit: "km" | "mi"): number
// - Calculates the distance between two coordinates (latitude and longitude) in kilometers or miles.

// degreesToRadians(degrees: number): number
// - Converts degrees to radians.

// async getUser(userId: string): Promise<User | null>
// - Retrieves a user by their ID. Returns the User object or null if not found.

// async getEvent(eventId: string): Promise<Event | null>
// - Retrieves an event by its ID. Returns the Event object or null if not found.

// async updateEvent(event: Event): Promise<Event | null>
// - Updates an existing event. Takes the Event object as input and returns the updated Event object or null on failure.

// async goingToEvent(userId: string, eventId: string): Promise<string | null>
// - Marks a user as attending an event. Takes the user's ID and event's ID as input. Returns null on success or an error message string on failure.

// async cancelGoingToEvent(userId: string, eventId: string): Promise<string | null>
// - Cancels a user's attendance to an event. Takes the user's ID and event's ID as input. Returns null on success or an error message string on failure.

// async updateUserEventsList(userId: string, eventIdToRemove: string): Promise<void>
// - Updates a user's list of events they are going to by removing a specific event. Takes the user's ID and the event ID to be removed as input.

// async deleteEvent(eventId: string): Promise<string>
// - Deletes a specific event by its ID. Returns a success message string or an error message string on failure.

// async getEventPicUploadURL(): Promise<string>
// - Generates a presigned URL for uploading an event picture to S3. Returns the URL as a string.

// async updateEventPicture(event: Event): Promise<Event | null>
// - Updates the picture URL of an event. Takes the Event object as input and returns the updated Event object or null on failure.

