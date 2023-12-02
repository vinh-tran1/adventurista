// Endpoints for Event Management System Testing Full Coverage

// POST /event/create - Create a new event
// GET /events/:userId - Fetch events for a given user by userID
// GET /event/:eventId - Retrieve details of a specific event by eventID
// POST /update-event - Update an existing event
// DELETE /event/:eventId - Delete a specific event (requires eventID)

// Utility Functions for Event Management System

// async getUser(userId: string): Promise<User | null>
// - Retrieves a user by their ID. Returns the User object or null if not found.

// async getEvent(eventId: string): Promise<Event | null>
// - Retrieves an event by its ID. Returns the Event object or null if not found.

// async updateEvent(event: Event): Promise<Event | null>
// - Updates an existing event. Takes the Event object as input and returns the updated Event object or null on failure.

// async deleteEvent(eventId: string): Promise<string>
// - Deletes a specific event by its ID. Returns a success message string or an error message string on failure.




import { createEvent, getEvents, getEvent, updateEvent, goingToEvent, cancelGoingToEvent, deleteEvent, getEventPicUploadURL, updateEventPicture } from '../src/events';
import { getUser, createUser, hashPassword, signIn, updateUser, updateUserAgeInterestsLocation, sendFriendRequest, unaddFriend, acceptFriendRequest, denyFriendRequest, blockUser, unblockUser, updateProfilePicture, updateBannerImage, markEventAsSeen, saveEvent } from '../src/users';
import { Event, User } from '../src/models';
import { AWSError, Request } from 'aws-sdk';
import * as sinon from 'sinon';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import * as s3 from 'aws-sdk/clients/s3';
import { sampleEventId, sampleEvent, newSampleEvent, sampleUserId, sampleUser } from './testConstants';
import { sampleEmail, sampleFirstName, sampleLastName, sampleUnhashedPassword, sampleUpdatedUser, sampleUserFriendsTesting, sampleUserNotBlockedTesting } from './testConstants';
import {db} from '../src/events';

const eventsFunctions = require("../src/events");
const usersFunctions = require("../src/users");

const sandbox = sinon.createSandbox();

describe('Create Event', () => {
  afterEach(() => {
    sandbox.restore();
  });

  it('When creation is successful', async () => {
    const returnValueMock = {
      promise() {
        return {
          Item: sampleUser,
        };
      },
    } as unknown as Request<DocumentClient.GetItemOutput, AWSError>;

    const stub = sandbox.stub(DocumentClient.prototype, 'get').returns(returnValueMock);

    const result = await getUser(sampleUserId);

    const returnValueMockEvent = {
      promise() {
        return {
          Item: sampleUserId,
        };
      },
    } as unknown as Request<DocumentClient.PutItemOutput, AWSError>;

    sandbox.stub(DocumentClient.prototype, 'put').returns(returnValueMockEvent);

    // get the event
    const user = await eventsFunctions.getEvent(sampleEventId);
    expect(user.userId).toEqual(sampleUserId);
  });

  it('When required event fields are missing', async () => {
    const returnValueMock = {
      promise() {
        return {
          Item: sampleUser,
        };
      },
    } as unknown as Request<DocumentClient.GetItemOutput, AWSError>;

    const stub = sandbox.stub(DocumentClient.prototype, 'get').returns(returnValueMock);

    const result = await getUser(sampleUserId);
    const incompleteEvent = { ...sampleEvent };
    incompleteEvent.title = ""; // Assuming title is a required field

    const result2: User | string = await createEvent(incompleteEvent as Event, "metricsId");
    expect(result2).toEqual("Error creating event");
  });

  it('When DynamoDB put fails', async () => {
    const returnValueMock = {
      promise() {
        return {
          Item: sampleUser,
        };
      },
    } as unknown as Request<DocumentClient.GetItemOutput, AWSError>;

    const stub = sandbox.stub(DocumentClient.prototype, 'get').returns(returnValueMock);

    const result = await getUser(sampleUserId);
    const returnValueMock2 = {
      promise() {
        return {
          Item: sampleEvent,
        };
      },
    } as unknown as Request<DocumentClient.PutItemOutput, AWSError>;

    sandbox.stub(DocumentClient.prototype, 'put').throwsException("Error creating event");


    const result2: User | string = await createEvent(sampleEvent, "metricsId");
    expect(result2).toEqual("Error creating event");
  });
});


describe('Get Events', () => {
  afterEach(() => {
    sandbox.restore();
  });

  it('When events are successfully retrieved', async () => {
    const returnValueMock = {
      promise() {
        return {
          Items: [sampleEvent, newSampleEvent], // Assuming multiple events are returned
        };
      },
    } as unknown as Request<DocumentClient.ScanOutput, AWSError>;

    sandbox.stub(DocumentClient.prototype, 'scan').returns(returnValueMock);

    const result: Event[] = await getEvents();
    expect(result).toEqual([sampleEvent, newSampleEvent]);
  });


  it('When DynamoDB scan fails', async () => {
    sandbox.stub(DocumentClient.prototype, 'scan').throwsException("Error fetching events");

    const result: Event[] = await getEvents();
    expect(result).toEqual([]);
  });
});


describe('Get Event', () => {
  afterEach(() => {
    sandbox.restore();
  });

  it('should retrieve an event by ID successfully', async () => {
    const returnValueMock = {
      promise() {
        return Promise.resolve({ Item: sampleEvent });
      },
    } as unknown as Request<DocumentClient.GetItemOutput, AWSError>;

    sandbox.stub(DocumentClient.prototype, 'get').returns(returnValueMock);

    const result = await getEvent(sampleEventId);

    expect(result).toEqual(sampleEvent);
  });
  it('should handle event not found', async () => {
    const returnValueMock = {
      promise() {
        return Promise.resolve({});
      },
    } as unknown as Request<DocumentClient.GetItemOutput, AWSError>;
  
    sandbox.stub(DocumentClient.prototype, 'get').returns(returnValueMock);
  
    const result = await getEvent(sampleEventId);
  
    expect(result).not.toEqual(sampleEvent);
  });
  it('should handle DynamoDB errors', async () => {
    const returnValueMock = {
      promise() {
        return Promise.reject("Error fetching event");
      },
    } as unknown as Request<DocumentClient.GetItemOutput, AWSError>;
    sandbox.stub(DocumentClient.prototype, 'scan').throwsException("Error fetching events");
  
    const result = await getEvent(sampleEventId);
    expect(result).toEqual(null);
  });
});


describe('Update Event', () => {
  afterEach(() => {
    sandbox.restore();
  });

  it('Should successfully update an event', async () => {
    const updatedEvent = { ...sampleEvent, title: 'Updated Title' };
    const returnValueMock = {
      promise() {
        return Promise.resolve({ Attributes: updatedEvent });
      },
    } as unknown as Request<DocumentClient.UpdateItemOutput, AWSError>;

    const stub = sandbox.stub(DocumentClient.prototype, 'update').returns(returnValueMock);

    const result = await updateEvent(updatedEvent);

    expect(result).toEqual(updatedEvent);
  });

  it('Should return null when the event does not exist', async () => {
    const stub = sandbox.stub(DocumentClient.prototype, 'update').throwsException("Event not found");

    const result = await updateEvent(sampleEvent);

    expect(result).toBeNull();
  });
});


describe('Delete Event', () => {
  afterEach(() => {
    sandbox.restore();
  });

  it('When DynamoDB delete is successful', async () => {
    // Mocking the response for getting the event before deleting
    const returnGetMock = {
      promise() {
        return Promise.resolve({ Item: sampleEvent });
      },
    } as unknown as Request<DocumentClient.GetItemOutput, AWSError>;
    sandbox.stub(DocumentClient.prototype, 'get').returns(returnGetMock);

    // Mocking the response for deleting the event
    const returnDeleteMock = {
      promise() {
        return Promise.resolve({});
      },
    } as unknown as Request<DocumentClient.DeleteItemOutput, AWSError>;
    const deleteStub = sandbox.stub(DocumentClient.prototype, 'delete').returns(returnDeleteMock);

    const result = await deleteEvent(sampleEventId);

    expect(deleteStub.calledWith(sinon.match({ Key: { eventId: sampleEventId } }))).toBe(true);
    expect(result).toEqual("Event successfully deleted");
  });

  it('When DynamoDB delete is not successful', async () => {
    // Mocking the response for getting the event before attempting delete
    const returnGetMock = {
      promise() {
        return Promise.resolve({ Item: sampleEvent });
      },
    } as unknown as Request<DocumentClient.GetItemOutput, AWSError>;
    sandbox.stub(DocumentClient.prototype, 'get').returns(returnGetMock);

    // Mocking the delete operation to throw an exception
    const deleteStub = sandbox.stub(DocumentClient.prototype, 'delete').throwsException("Unable to delete event");

    let error = null;
    try {
      await deleteEvent(sampleEventId);
    } catch (e) {
      error = e;
    }

    expect(error).toBeNull();
  });
});

describe('Going To Event', () => {
  afterEach(() => {
    sandbox.restore();
  });

  it('should mark attendance successfully', async () => {
    const returnValueMock = {
      promise() {
        return {
          Item: sampleUser,
        };
      },
    } as unknown as Request<DocumentClient.GetItemOutput, AWSError>;

    const stub = sandbox.stub(DocumentClient.prototype, 'get').returns(returnValueMock);
    const user = await getUser(sampleUserId);
    sandbox.stub(eventsFunctions, 'getUser').resolves(sampleUser);
    sandbox.stub(eventsFunctions, 'getEvent').resolves(sampleEvent);
    const returnValueMock2 = {
      promise() {
        return {
          Item : "",
        };
      },
    } as unknown as Request<DocumentClient.GetItemOutput, AWSError>;
    const stub1 = sandbox.stub(DocumentClient.prototype, 'update').returns(returnValueMock2);

    const result = await goingToEvent(sampleUserId, sampleEventId);
    expect(result).toEqual(sampleUser);
  });

  it('should handle user or event not found', async () => {
   
    sandbox.stub(eventsFunctions, 'getUser').resolves(null);
    sandbox.stub(eventsFunctions, 'getEvent').resolves(null);

    const result = await goingToEvent(sampleUserId, sampleEventId);
    expect(result).toBeNull();
  });

  // it('should handle user already attending', async () => {
  //   sampleEvent.whoIsGoing = [sampleUserId];
  //   sampleUser.eventsGoingTo = [sampleEventId];
    // const returnValueMock = {
    //   promise() {
    //     return {
    //       Item: sampleUser,
    //     };
    //   },
    // } as unknown as Request<DocumentClient.GetItemOutput, AWSError>;

    // const stub = sandbox.stub(DocumentClient.prototype, 'get').returns(returnValueMock);
    // const user = await getUser(sampleUserId);
  //   sandbox.stub(eventsFunctions, 'getUser').resolves({...sampleUser, eventsGoingTo: [sampleEventId]});
  //   sandbox.stub(eventsFunctions, 'getEvent').resolves({ ...sampleEvent, whoIsGoing: [sampleUserId] });
  //   const returnValueMock2 = {
  //     promise() {
  //       return {
  //         Item : "",
  //       };
  //     },
  //   } as unknown as Request<DocumentClient.GetItemOutput, AWSError>;
  //   const stub1 = sandbox.stub(DocumentClient.prototype, 'update').returns(returnValueMock2);

  //   const result = await goingToEvent(sampleUserId, sampleEventId);
  //   expect(result).toEqual("User is already going to event");
  // });

  // it('should handle DynamoDB errors during marking attendance', async () => {
  //   const returnValueMock = {
  //     promise() {
  //       return {
  //         Item: sampleUser,
  //       };
  //     },
  //   } as unknown as Request<DocumentClient.GetItemOutput, AWSError>;

  //   const stub = sandbox.stub(DocumentClient.prototype, 'get').returns(returnValueMock);
  //   const user = await getUser(sampleUserId);
  //   sandbox.stub(eventsFunctions, 'getUser').resolves({...sampleUser, eventsGoingTo: [""]});
  //   sandbox.stub(eventsFunctions, 'getEvent').resolves({...sampleEvent, whoIsGoing: [""]});
  //   sandbox.stub(DocumentClient.prototype, 'update').throwsException(new Error("DynamoDB error"));

  //   const result = await goingToEvent(sampleUserId, sampleEventId);
  //   expect(result).toContain("Error updating");
  // });
});

describe('Cancel Going To Event', () => {
  afterEach(() => {
    sandbox.restore();
  });

  it('should cancel attendance successfully', async () => {
    const returnValueMock = {
      promise() {
        return {
          Item: sampleUser,
        };
      },
    } as unknown as Request<DocumentClient.GetItemOutput, AWSError>;

    const stub = sandbox.stub(DocumentClient.prototype, 'get').returns(returnValueMock);
    const user = await getUser(sampleUserId);
    sandbox.stub(usersFunctions, 'getUser').resolves(sampleUser);
    sandbox.stub(eventsFunctions, 'getEvent').resolves(sampleEvent);
    const returnValueMock2 = {
      promise() {
        return {
          Item : "",
        };
      },
    } as unknown as Request<DocumentClient.GetItemOutput, AWSError>;
    const stub1 = sandbox.stub(DocumentClient.prototype, 'update').returns(returnValueMock2);

    const result = await cancelGoingToEvent(sampleUserId, sampleEventId);
    expect(result).toBeNull();
  });

  it('should handle user or event not found during cancellation', async () => {
    
    sandbox.stub(usersFunctions, 'getUser').resolves(null);
    sandbox.stub(eventsFunctions, 'getEvent').resolves(null);
    const returnValueMock = {
      promise() {
        return {
          Item : "",
        };
      },
    } as unknown as Request<DocumentClient.GetItemOutput, AWSError>;

    const result = await cancelGoingToEvent(sampleUserId, sampleEventId);
    expect(result).toEqual("User or Event not found");
  });

  it('should handle user not marked as attending', async () => {
    sampleEvent.whoIsGoing = [];
    sampleUser.eventsGoingTo = [];
    const returnValueMock = {
      promise() {
        return {
          Item: sampleUser,
        };
      },
    } as unknown as Request<DocumentClient.GetItemOutput, AWSError>;
    const returnValueMock2 = {
      promise() {
        return {
          Item : "",
        };
      },
    } as unknown as Request<DocumentClient.GetItemOutput, AWSError>;
    const stub1 = sandbox.stub(DocumentClient.prototype, 'update').returns(returnValueMock2);

    const stub = sandbox.stub(DocumentClient.prototype, 'get').returns(returnValueMock);
    const user = await getUser(sampleUserId);
    sandbox.stub(usersFunctions, 'getUser').resolves(sampleUser);
    sandbox.stub(eventsFunctions, 'getEvent').resolves(sampleEvent);

    const result = await cancelGoingToEvent(sampleUserId, sampleEventId);
    expect(result).toEqual("User never marked attendance for event");
  });

  it('should handle DynamoDB errors during cancelling attendance', async () => {
    const returnValueMock = {
      promise() {
        return {
          Item: sampleUser,
        };
      },
    } as unknown as Request<DocumentClient.GetItemOutput, AWSError>;

    
    

    const stub = sandbox.stub(DocumentClient.prototype, 'get').returns(returnValueMock);
    const user = await getUser(sampleUserId);



    sandbox.stub(usersFunctions, 'getUser').resolves(sampleUser);
    sandbox.stub(eventsFunctions, 'getEvent').resolves(sampleEvent);
    sandbox.stub(DocumentClient.prototype, 'update').throwsException(new Error("DynamoDB error"));

    const result = await cancelGoingToEvent(sampleUserId, sampleEventId);
    expect(result).toContain("User never marked attendance for event");
  });
});




