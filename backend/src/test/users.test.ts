import { getUser } from '../src/users';
import { User } from '../src/models';
import { AWSError, Request } from 'aws-sdk';
import sinon = require('sinon');
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { sampleUser, sampleUserId } from './testConstants';

const sandbox = sinon.createSandbox();

describe('Get User', () => {
  afterEach(() => {
    sandbox.restore();
  });
  
  it('When user exists', async () => {
    const returnValueMock = {
        promise () {
          return {
            Item: sampleUser,
          };
        },
      } as unknown as Request <DocumentClient.GetItemOutput, AWSError>;
            
      const stub = sandbox.stub(DocumentClient.prototype, 'get').returns(returnValueMock);

      const result = await getUser(sampleUserId);
      expect(result).toEqual(sampleUser);
  });

//   it('When user does not exist', async () => {
//     const returnValueMock = {
//         promise () {
//           return {
//             Item: sampleUser,
//           };
//         },
//       } as unknown as Request <DocumentClient.GetItemOutput, AWSError>;
            
//       const stub = sandbox.stub(DocumentClient.prototype, 'get').throwsException("User does not exist");

//       const result = await getUser(sampleUserId);
//       expect(result).not.toEqual(sampleUser);
//   });
});