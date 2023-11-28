import { getUser, createUser, hashPassword, signIn, updateUser } from '../src/users';
import { User } from '../src/models';
import { AWSError, Request } from 'aws-sdk';
import * as sinon from 'sinon';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { sampleEmail, sampleFirstName, sampleLastName, sampleUnhashedPassword, sampleUpdatedUser, sampleUser, sampleUserId } from './testConstants';

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
  
    it('When DynamoDB put fails', async () => {
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
              
        const stub = sandbox.stub(DocumentClient.prototype, 'get').throwsException("Error creating user");
  
        const result = await getUser(sampleUserId);
        expect(result).not.toEqual(sampleUser);
    });
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

describe('Update User', () => {
    afterEach(() => {
      sandbox.restore();
    });
    
    it('When DynamoDB update is successful', async () => {
      const returnValueMock = {
          promise () {
            return {
                Attributes: sampleUpdatedUser,
            };
          },
        } as unknown as Request <DocumentClient.UpdateItemOutput, AWSError>;
              
        const stub = sandbox.stub(DocumentClient.prototype, 'update').returns(returnValueMock);
  
        const result = await updateUser(sampleUpdatedUser);
        expect(result).toEqual(sampleUpdatedUser);
    });
  
    it('When DynamoDB update is not successful', async () => {
      const returnValueMock = {
          promise () {
            return {
              Attributes: sampleUpdatedUser,
            };
          },
        } as unknown as Request <DocumentClient.UpdateItemOutput, AWSError>;
              
        const stub = sandbox.stub(DocumentClient.prototype, 'update').throwsException("Enable to update user table");
  
        const result = await updateUser(sampleUpdatedUser);
        expect(result).toBeNull();
    });

    // DDB Update will create new user when it does not already exist in the users table
    // Thus, checking for user existence is futile
  });

describe('User sign in', () => {
    afterEach(() => {
      sandbox.restore();
    });

    it('Valid sign in attempt', async () => {
        const returnSignInMock = {
            promise () {
              return {
                Items: [sampleUser],
                Count: 1,
              };
            },
          } as unknown as Request <DocumentClient.QueryOutput, AWSError>;
                
        sandbox.stub(DocumentClient.prototype, 'query').returns(returnSignInMock);
  
        const result = await signIn(sampleEmail, sampleUnhashedPassword);
        const user: User = sampleUser;
        if (result !== false) {
            user.hashedPassword = result.hashedPassword;
        }
        expect(result).toEqual(user);
    });

    it('Multiple users with the same email (should never occur)', async () => {
        const returnSignInMock = {
            promise () {
              return {
                Count: 2,
              };
            },
          } as unknown as Request <DocumentClient.QueryOutput, AWSError>;
                
        sandbox.stub(DocumentClient.prototype, 'query').returns(returnSignInMock);
  
        const result = await signIn(sampleEmail, sampleUnhashedPassword);
        expect(result).toEqual(false);
    });
    
    it('User does not exist', async () => {
        const returnSignInMock = {
            promise () {
              return {
                Count: 0,
              };
            },
          } as unknown as Request <DocumentClient.QueryOutput, AWSError>;
                
        sandbox.stub(DocumentClient.prototype, 'query').returns(returnSignInMock);
  
        const result = await signIn(sampleEmail, sampleUnhashedPassword);
        expect(result).toEqual(false);
    });
  
    it('When DynamoDB get fails', async () => {
        const returnSignInMock = {
            promise () {
              return {
                Count: 1,
              };
            },
          } as unknown as Request <DocumentClient.QueryOutput, AWSError>;
              
        const stub = sandbox.stub(DocumentClient.prototype, 'get').throwsException("DynamoDB query failed");
  
        const result = await signIn(sampleEmail, sampleUnhashedPassword);
        expect(result).toEqual(false);
    });
  });