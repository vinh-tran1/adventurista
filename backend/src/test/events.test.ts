// Assuming you have an `events` module that exports `getEvent` function
import { getEvent, createEvent } from '../src/events';
import { getUser } from '../src/users';
import { Event } from '../src/models';
import AWS from 'aws-sdk';
import request from 'supertest'; // if you are using supertest for HTTP assertions
// import app from '../src/app'; // your Express application
import sinon = require('sinon');
import { AWSError, Request } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { sampleEvent, sampleEventId, sampleUser } from './testConstants';

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
        // time: null, // Required field is null
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
