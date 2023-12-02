import { getUser, createUser, hashPassword, signIn, updateUser, updateUserAgeInterestsLocation, sendFriendRequest, unaddFriend, acceptFriendRequest, denyFriendRequest, blockUser, unblockUser, updateProfilePicture, updateBannerImage, markEventAsSeen, saveEvent, getEvent } from '../src/users';
import { User } from '../src/models';
import { AWSError, Request } from 'aws-sdk';
import * as sinon from 'sinon';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import * as s3 from 'aws-sdk/clients/s3';
import { sampleEmail, sampleEvent, sampleFirstName, sampleLastName, sampleUnhashedPassword, sampleUpdatedUser, sampleUser, sampleUserFriendsTesting, sampleUserId, sampleUserNotBlockedTesting } from './testConstants';

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

describe('Update User Age Interests Location', () => {
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
  
        const result = await updateUserAgeInterestsLocation(sampleUpdatedUser);
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
  
        const result = await updateUserAgeInterestsLocation(sampleUpdatedUser);
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

  describe('Send Friend Request', () => {
    afterEach(() => {
      sandbox.restore();
    });
    
    it('When users are found and when DynamoDB update is successful', async () => {
        const returnGetUserMock = {
            promise () {
              return {
                Item: sampleUpdatedUser,
              };
            },
          } as unknown as Request <DocumentClient.GetItemOutput, AWSError>;
                
        sandbox.stub(DocumentClient.prototype, 'get').returns(returnGetUserMock);

      const returnValueMock = {
          promise () {
            return {
                Attributes: sampleUpdatedUser,
            };
          },
        } as unknown as Request <DocumentClient.UpdateItemOutput, AWSError>;
              
        const stub = sandbox.stub(DocumentClient.prototype, 'update').returns(returnValueMock);
  
        const result = await sendFriendRequest("requesterUserId", "requesteeUserId");
        expect(result).toEqual(sampleUpdatedUser);
    });

    it('When users are not found', async () => {
        const returnGetUserMock = {
            promise () {
              return {
                Item: sampleUser,
              };
            },
          } as unknown as Request <DocumentClient.GetItemOutput, AWSError>;
                
        sandbox.stub(DocumentClient.prototype, 'get').throwsException("Could not find users");

        const result = await sendFriendRequest("requesterUserId", "requesteeUserId");
        expect(result).toBeNull();
    });
  
    it('When DynamoDB update is not successful', async () => {
        const returnGetUserMock = {
            promise () {
              return {
                Item: sampleUser,
              };
            },
          } as unknown as Request <DocumentClient.GetItemOutput, AWSError>;
                
        sandbox.stub(DocumentClient.prototype, 'get').returns(returnGetUserMock);

      const returnValueMock = {
          promise () {
            return {
              Attributes: sampleUpdatedUser,
            };
          },
        } as unknown as Request <DocumentClient.UpdateItemOutput, AWSError>;
              
        const stub = sandbox.stub(DocumentClient.prototype, 'update').throwsException("Enable to update user table");
  
        const result = await sendFriendRequest("requesterUserId", "requesteeUserId");
        expect(result).toBeNull();
    });
});

describe('Unadd friend', () => {
    afterEach(() => {
      sandbox.restore();
    });
    
    it('When users are found and when DynamoDB update is successful', async () => {
        const returnGetUserMock = {
            promise () {
              return {
                Item: sampleUpdatedUser,
              };
            },
          } as unknown as Request <DocumentClient.GetItemOutput, AWSError>;
                
        sandbox.stub(DocumentClient.prototype, 'get').returns(returnGetUserMock);

      const returnValueMock = {
          promise () {
            return {
                Attributes: sampleUpdatedUser,
            };
          },
        } as unknown as Request <DocumentClient.UpdateItemOutput, AWSError>;
              
        const stub = sandbox.stub(DocumentClient.prototype, 'update').returns(returnValueMock);
  
        const result = await unaddFriend("requesterUserId", "requesteeUserId");
        expect(result).toEqual(sampleUpdatedUser);
    });

    it('When users are not friends to begin with', async () => {
        const returnGetUserMock = {
            promise () {
              return {
                Item: sampleUser,
              };
            },
          } as unknown as Request <DocumentClient.GetItemOutput, AWSError>;
                
        sandbox.stub(DocumentClient.prototype, 'get').returns(returnGetUserMock);

      const returnValueMock = {
          promise () {
            return {
                Attributes: sampleUser,
            };
          },
        } as unknown as Request <DocumentClient.UpdateItemOutput, AWSError>;
              
        const stub = sandbox.stub(DocumentClient.prototype, 'update').returns(returnValueMock);
  
        const result = await unaddFriend("requesterUserId", "requesteeUserId");
        expect(result).toBeNull();
    });

    it('When users are not found', async () => {
        const returnGetUserMock = {
            promise () {
              return {
                Item: sampleUser,
              };
            },
          } as unknown as Request <DocumentClient.GetItemOutput, AWSError>;
                
        sandbox.stub(DocumentClient.prototype, 'get').throwsException("Could not find users");

        const result = await unaddFriend("requesterUserId", "requesteeUserId");
        expect(result).toBeNull();
    });
  
    it('When DynamoDB update is not successful', async () => {
        const returnGetUserMock = {
            promise () {
              return {
                Item: sampleUser,
              };
            },
          } as unknown as Request <DocumentClient.GetItemOutput, AWSError>;
                
        sandbox.stub(DocumentClient.prototype, 'get').returns(returnGetUserMock);

      const returnValueMock = {
          promise () {
            return {
              Attributes: sampleUpdatedUser,
            };
          },
        } as unknown as Request <DocumentClient.UpdateItemOutput, AWSError>;
              
        const stub = sandbox.stub(DocumentClient.prototype, 'update').throwsException("Enable to update user table");
  
        const result = await unaddFriend("requesterUserId", "requesteeUserId");
        expect(result).toBeNull();
    });
});

describe('Accept friend request', () => {
    afterEach(() => {
      sandbox.restore();
    });
    
    it('When users are found and when DynamoDB update is successful', async () => {
        const returnGetUserMock = {
            promise () {
              return {
                Item: sampleUpdatedUser,
              };
            },
          } as unknown as Request <DocumentClient.GetItemOutput, AWSError>;
                
        sandbox.stub(DocumentClient.prototype, 'get').returns(returnGetUserMock);

      const returnValueMock = {
          promise () {
            return {
                Attributes: sampleUpdatedUser,
            };
          },
        } as unknown as Request <DocumentClient.UpdateItemOutput, AWSError>;
              
        const stub = sandbox.stub(DocumentClient.prototype, 'update').returns(returnValueMock);
  
        const result = await acceptFriendRequest("requesterUserId", "requesteeUserId");
        expect(result).toEqual(sampleUpdatedUser);
    });

    it('When users do not have incoming / outgoing friend requests', async () => {
        const returnGetUserMock = {
            promise () {
              return {
                Item: sampleUserFriendsTesting,
              };
            },
          } as unknown as Request <DocumentClient.GetItemOutput, AWSError>;
                
        sandbox.stub(DocumentClient.prototype, 'get').returns(returnGetUserMock);

      const returnValueMock = {
          promise () {
            return {
                Attributes: sampleUserFriendsTesting,
            };
          },
        } as unknown as Request <DocumentClient.UpdateItemOutput, AWSError>;
              
        const stub = sandbox.stub(DocumentClient.prototype, 'update').returns(returnValueMock);
  
        const result = await acceptFriendRequest("requesterUserId", "requesteeUserId");
        expect(result).toBeNull();
    });

    it('When users are not found', async () => {
        const returnGetUserMock = {
            promise () {
              return {
                Item: sampleUser,
              };
            },
          } as unknown as Request <DocumentClient.GetItemOutput, AWSError>;
                
        sandbox.stub(DocumentClient.prototype, 'get').throwsException("Could not find users");

        const result = await acceptFriendRequest("requesterUserId", "requesteeUserId");
        expect(result).toBeNull();
    });
  
    it('When DynamoDB update is not successful', async () => {
        const returnGetUserMock = {
            promise () {
              return {
                Item: sampleUser,
              };
            },
          } as unknown as Request <DocumentClient.GetItemOutput, AWSError>;
                
        sandbox.stub(DocumentClient.prototype, 'get').returns(returnGetUserMock);

      const returnValueMock = {
          promise () {
            return {
              Attributes: sampleUpdatedUser,
            };
          },
        } as unknown as Request <DocumentClient.UpdateItemOutput, AWSError>;
              
        const stub = sandbox.stub(DocumentClient.prototype, 'update').throwsException("Enable to update user table");
  
        const result = await acceptFriendRequest("requesterUserId", "requesteeUserId");
        expect(result).toBeNull();
    });
});

describe('Deny friend request', () => {
    afterEach(() => {
      sandbox.restore();
    });
    
    it('When users are found and when DynamoDB update is successful', async () => {
        const returnGetUserMock = {
            promise () {
              return {
                Item: sampleUpdatedUser,
              };
            },
          } as unknown as Request <DocumentClient.GetItemOutput, AWSError>;
                
        sandbox.stub(DocumentClient.prototype, 'get').returns(returnGetUserMock);

      const returnValueMock = {
          promise () {
            return {
                Attributes: sampleUpdatedUser,
            };
          },
        } as unknown as Request <DocumentClient.UpdateItemOutput, AWSError>;
              
        const stub = sandbox.stub(DocumentClient.prototype, 'update').returns(returnValueMock);
  
        const result = await denyFriendRequest("requesterUserId", "requesteeUserId");
        expect(result).toEqual(sampleUpdatedUser);
    });

    it('When users do not have incoming / outgoing friend requests', async () => {
        const returnGetUserMock = {
            promise () {
              return {
                Item: sampleUserFriendsTesting,
              };
            },
          } as unknown as Request <DocumentClient.GetItemOutput, AWSError>;
                
        sandbox.stub(DocumentClient.prototype, 'get').returns(returnGetUserMock);

      const returnValueMock = {
          promise () {
            return {
                Attributes: sampleUserFriendsTesting,
            };
          },
        } as unknown as Request <DocumentClient.UpdateItemOutput, AWSError>;
              
        const stub = sandbox.stub(DocumentClient.prototype, 'update').returns(returnValueMock);
  
        const result = await denyFriendRequest("requesterUserId", "requesteeUserId");
        expect(result).toBeNull();
    });

    it('When users are not found', async () => {
        const returnGetUserMock = {
            promise () {
              return {
                Item: sampleUser,
              };
            },
          } as unknown as Request <DocumentClient.GetItemOutput, AWSError>;
                
        sandbox.stub(DocumentClient.prototype, 'get').throwsException("Could not find users");

        const result = await denyFriendRequest("requesterUserId", "requesteeUserId");
        expect(result).toBeNull();
    });
  
    it('When DynamoDB update is not successful', async () => {
        const returnGetUserMock = {
            promise () {
              return {
                Item: sampleUser,
              };
            },
          } as unknown as Request <DocumentClient.GetItemOutput, AWSError>;
                
        sandbox.stub(DocumentClient.prototype, 'get').returns(returnGetUserMock);

      const returnValueMock = {
          promise () {
            return {
              Attributes: sampleUpdatedUser,
            };
          },
        } as unknown as Request <DocumentClient.UpdateItemOutput, AWSError>;
              
        const stub = sandbox.stub(DocumentClient.prototype, 'update').throwsException("Enable to update user table");
  
        const result = await denyFriendRequest("requesterUserId", "requesteeUserId");
        expect(result).toBeNull();
    });
});

describe('Block user', () => {
    afterEach(() => {
      sandbox.restore();
    });
    
    it('When users are found and when DynamoDB update is successful', async () => {
        const returnGetUserMock = {
            promise () {
              return {
                Item: sampleUpdatedUser,
              };
            },
          } as unknown as Request <DocumentClient.GetItemOutput, AWSError>;
                
        sandbox.stub(DocumentClient.prototype, 'get').returns(returnGetUserMock);

      const returnValueMock = {
          promise () {
            return {
                Attributes: sampleUpdatedUser,
            };
          },
        } as unknown as Request <DocumentClient.UpdateItemOutput, AWSError>;
              
        const stub = sandbox.stub(DocumentClient.prototype, 'update').returns(returnValueMock);
  
        const result = await blockUser("blockerUserId", "blockedUserId");
        expect(result).toEqual(sampleUpdatedUser);
    });

    it('When user is already blocked', async () => {
        const returnGetUserMock = {
            promise () {
              return {
                Item: sampleUserFriendsTesting,
              };
            },
          } as unknown as Request <DocumentClient.GetItemOutput, AWSError>;
                
        sandbox.stub(DocumentClient.prototype, 'get').returns(returnGetUserMock);

      const returnValueMock = {
          promise () {
            return {
                Attributes: sampleUserFriendsTesting,
            };
          },
        } as unknown as Request <DocumentClient.UpdateItemOutput, AWSError>;
              
        const stub = sandbox.stub(DocumentClient.prototype, 'update').returns(returnValueMock);
  
        const result = await blockUser("blockerUserId", "blockedUserId");
        expect(result).toBeNull();
    });

    it('When users are not found', async () => {
        const returnGetUserMock = {
            promise () {
              return {
                Item: sampleUser,
              };
            },
          } as unknown as Request <DocumentClient.GetItemOutput, AWSError>;
                
        sandbox.stub(DocumentClient.prototype, 'get').throwsException("Could not find users");

        const result = await blockUser("blockerUserId", "blockedUserId");
        expect(result).toBeNull();
    });
  
    it('When DynamoDB update is not successful', async () => {
        const returnGetUserMock = {
            promise () {
              return {
                Item: sampleUser,
              };
            },
          } as unknown as Request <DocumentClient.GetItemOutput, AWSError>;
                
        sandbox.stub(DocumentClient.prototype, 'get').returns(returnGetUserMock);

      const returnValueMock = {
          promise () {
            return {
              Attributes: sampleUpdatedUser,
            };
          },
        } as unknown as Request <DocumentClient.UpdateItemOutput, AWSError>;
              
        const stub = sandbox.stub(DocumentClient.prototype, 'update').throwsException("Enable to update user table");
  
        const result = await blockUser("blockerUserId", "blockedUserId");
        expect(result).toBeNull();
    });
});

describe('Unblock user', () => {
    afterEach(() => {
      sandbox.restore();
    });
    
    it('When users are found and when DynamoDB update is successful', async () => {
        const returnGetUserMock = {
            promise () {
              return {
                Item: sampleUserFriendsTesting,
              };
            },
          } as unknown as Request <DocumentClient.GetItemOutput, AWSError>;
                
        sandbox.stub(DocumentClient.prototype, 'get').returns(returnGetUserMock);

      const returnValueMock = {
          promise () {
            return {
                Attributes: sampleUserFriendsTesting,
            };
          },
        } as unknown as Request <DocumentClient.UpdateItemOutput, AWSError>;
              
        const stub = sandbox.stub(DocumentClient.prototype, 'update').returns(returnValueMock);
  
        const result = await unblockUser("blockerUserId", "blockedUserId");
        expect(result).toEqual(sampleUserFriendsTesting);
    });

    it('When user is not blocked', async () => {
        const returnGetUserMock = {
            promise () {
              return {
                Item: sampleUserNotBlockedTesting,
              };
            },
          } as unknown as Request <DocumentClient.GetItemOutput, AWSError>;
                
        sandbox.stub(DocumentClient.prototype, 'get').returns(returnGetUserMock);

      const returnValueMock = {
          promise () {
            return {
                Attributes: sampleUserNotBlockedTesting,
            };
          },
        } as unknown as Request <DocumentClient.UpdateItemOutput, AWSError>;
              
        const stub = sandbox.stub(DocumentClient.prototype, 'update').returns(returnValueMock);
  
        const result = await unblockUser("blockerUserId", "blockedUserId");
        expect(result).toBeNull();
    });

    it('When users are not found', async () => {
        const returnGetUserMock = {
            promise () {
              return {
                Item: sampleUserFriendsTesting,
              };
            },
          } as unknown as Request <DocumentClient.GetItemOutput, AWSError>;
                
        sandbox.stub(DocumentClient.prototype, 'get').throwsException("Could not find users");

        const result = await unblockUser("blockerUserId", "blockedUserId");
        expect(result).toBeNull();
    });
  
    it('When DynamoDB update is not successful', async () => {
        const returnGetUserMock = {
            promise () {
              return {
                Item: sampleUserFriendsTesting,
              };
            },
          } as unknown as Request <DocumentClient.GetItemOutput, AWSError>;
                
        sandbox.stub(DocumentClient.prototype, 'get').returns(returnGetUserMock);

      const returnValueMock = {
          promise () {
            return {
              Attributes: sampleUserFriendsTesting,
            };
          },
        } as unknown as Request <DocumentClient.UpdateItemOutput, AWSError>;
              
        const stub = sandbox.stub(DocumentClient.prototype, 'update').throwsException("Enable to update user table");
  
        const result = await unblockUser("blockerUserId", "blockedUserId");
        expect(result).toBeNull();
    });
});

describe('Update Profile Picture', () => {
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
  
        const result = await updateProfilePicture(sampleUpdatedUser);
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
  
        const result = await updateProfilePicture(sampleUpdatedUser);
        expect(result).toBeNull();
    });

    // DDB Update will create new user when it does not already exist in the users table
    // Thus, checking for user existence is futile
});

describe('Update Banner Image', () => {
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
  
        const result = await updateBannerImage(sampleUpdatedUser);
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
  
        const result = await updateBannerImage(sampleUpdatedUser);
        expect(result).toBeNull();
    });

    // DDB Update will create new user when it does not already exist in the users table
    // Thus, checking for user existence is futile
});

describe('Mark Event As Seen', () => {
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
              
        sandbox.stub(DocumentClient.prototype, 'update').returns(returnValueMock);
  
        const returnGetMock = {
            promise () {
              return {
                Item: sampleUpdatedUser,
              };
            },
          } as unknown as Request <DocumentClient.GetItemOutput, AWSError>;
                
          const stub = sandbox.stub(DocumentClient.prototype, 'get').returns(returnGetMock);

        const result = await markEventAsSeen("userId", "eventId");
        expect(result).toEqual(sampleUpdatedUser);
    });

    it('When user does not exist', async () => {
        const returnValueMock = {
            promise () {
              return {
                  Attributes: sampleUpdatedUser,
              };
            },
          } as unknown as Request <DocumentClient.UpdateItemOutput, AWSError>;
                
          sandbox.stub(DocumentClient.prototype, 'update').returns(returnValueMock);
    
          const returnGetMock = {
              promise () {
                return {
                  Item: sampleUpdatedUser,
                };
              },
            } as unknown as Request <DocumentClient.GetItemOutput, AWSError>;
                  
            const stub = sandbox.stub(DocumentClient.prototype, 'get').throwsException("Enable to fetch user from users table");
  
          const result = await markEventAsSeen("userId", "eventId");
          expect(result).toBeNull();
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
  
        const result = await markEventAsSeen("userId", "eventId");
        expect(result).toBeNull();
    });

    // DDB Update will create new user when it does not already exist in the users table
    // Thus, checking for user existence is futile
});

describe('User Saves Event (For Later)', () => {
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
              
        sandbox.stub(DocumentClient.prototype, 'update').returns(returnValueMock);

        const returnGetMock = {
            promise () {
              return {
                Item: sampleUpdatedUser,
              };
            },
          } as unknown as Request <DocumentClient.GetItemOutput, AWSError>;
                
          const stub = sandbox.stub(DocumentClient.prototype, 'get').returns(returnGetMock);

        const result = await saveEvent("userId", "eventId");
        expect(result).toEqual(sampleUpdatedUser);
    });

    it('When user does not exist', async () => {
        const returnValueMock = {
            promise () {
              return {
                  Attributes: sampleUpdatedUser,
              };
            },
          } as unknown as Request <DocumentClient.UpdateItemOutput, AWSError>;
                
          sandbox.stub(DocumentClient.prototype, 'update').returns(returnValueMock);
    
          const returnGetMock = {
              promise () {
                return {
                  Item: sampleUpdatedUser,
                };
              },
            } as unknown as Request <DocumentClient.GetItemOutput, AWSError>;
                  
            const stub = sandbox.stub(DocumentClient.prototype, 'get').throwsException("Enable to fetch user from users table");
  
          const result = await saveEvent("userId", "eventId");
          expect(result).toBeNull();
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
  
        const result = await saveEvent("userId", "eventId");
        expect(result).toBeNull();
    });

    // DDB Update will create new user when it does not already exist in the users table
    // Thus, checking for user existence is futile
});

describe('Get Event for a User', () => {
    afterEach(() => {
      sandbox.restore();
    });
    
    it('When event exists', async () => {
      const returnValueMock = {
          promise () {
            return {
              Item: sampleEvent,
            };
          },
        } as unknown as Request <DocumentClient.GetItemOutput, AWSError>;
              
        const stub = sandbox.stub(DocumentClient.prototype, 'get').returns(returnValueMock);
  
        const result = await getEvent("eventId");
        expect(result).toEqual(sampleEvent);
    });
  
    it('When event does not exist / when DynamoDB get fails', async () => {
      const returnValueMock = {
          promise () {
            return {
              Item: sampleEvent,
            };
          },
        } as unknown as Request <DocumentClient.GetItemOutput, AWSError>;
              
        const stub = sandbox.stub(DocumentClient.prototype, 'get').throwsException("Event does not exist / user does not have access to event");
  
        const result = await getEvent("eventId");
        expect(result).not.toEqual(sampleEvent);
    });
  });