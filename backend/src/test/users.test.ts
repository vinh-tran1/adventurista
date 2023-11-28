import { getUser, createUser, hashPassword } from '../src/users';
import { User } from '../src/models';
import { AWSError, Request } from 'aws-sdk';
import * as sinon from 'sinon';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { sampleEmail, sampleFirstName, sampleLastName, sampleUnhashedPassword, sampleUser, sampleUserId } from './testConstants';

const usersFunctions = require("../src/users");

const sandbox = sinon.createSandbox();

describe('Create User', () => {
    afterEach(() => {
      sandbox.restore();
    });
    
    it('When creation is successful', async () => {
        const returnEmailExistsMock = {
            promise () {
              return {
                Count: 0,
              };
            },
          } as unknown as Request <DocumentClient.QueryOutput, AWSError>;
                
        sandbox.stub(DocumentClient.prototype, 'query').returns(returnEmailExistsMock);

        const returnValueMock = {
            promise() {
                return {
                    Item: sampleUser,
                };
            },
        } as unknown as Request<DocumentClient.PutItemOutput, AWSError>;

        sandbox.stub(DocumentClient.prototype, 'put').returns(returnValueMock);

        // jest.mock('../src/users', () => ({
        //   hashPassword: jest.fn(),
        // }));
        
        // Set the mockResolvedValue for the hashPassword function
        //(hashPassword as jest.Mock).mockResolvedValue(sampleUnhashedPassword);

        const result: User | string = await createUser(sampleEmail, sampleFirstName, sampleLastName, sampleUnhashedPassword);
        let user: User = sampleUser;
        if (typeof result !== 'string') {
            user.userId = result.userId;
            user.hashedPassword = result.hashedPassword;
        }
        expect(user).toEqual(result);
      });

    it('When email is already associated with another account', async () => {
        const returnEmailExistsMock = {
            promise () {
              return {
                Count: 1,
              };
            },
          } as unknown as Request <DocumentClient.QueryOutput, AWSError>;
                
        sandbox.stub(DocumentClient.prototype, 'query').returns(returnEmailExistsMock);

        const returnValueMock = {
            promise() {
                return {
                    Item: sampleUser,
                };
            },
        } as unknown as Request<DocumentClient.PutItemOutput, AWSError>;

        sandbox.stub(DocumentClient.prototype, 'put').returns(returnValueMock);

        const result: User | string = await createUser(sampleEmail, sampleFirstName, sampleLastName, sampleUnhashedPassword);
        expect(result).toEqual("Email already in use");
    });
  
    // it('When DynamoDB put fails', async () => {
    //   const returnValueMock = {
    //       promise () {
    //         return {
    //           Item: sampleUser,
    //         };
    //       },
    //     } as unknown as Request <DocumentClient.GetItemOutput, AWSError>;
              
    //     const stub = sandbox.stub(DocumentClient.prototype, 'get').throwsException("User does not exist");
  
    //     const result = await getUser(sampleUserId);
    //     expect(result).not.toEqual(sampleUser);
    // });
  });

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

  it('When user does not exist / when DynamoDB get fails', async () => {
    const returnValueMock = {
        promise () {
          return {
            Item: sampleUser,
          };
        },
      } as unknown as Request <DocumentClient.GetItemOutput, AWSError>;
            
      const stub = sandbox.stub(DocumentClient.prototype, 'get').throwsException("User does not exist");

      const result = await getUser(sampleUserId);
      expect(result).not.toEqual(sampleUser);
  });
});