import { AWSError, Request } from 'aws-sdk';
import * as sinon from 'sinon';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { sampleGroupChat, sampleMessage, sampleUser } from './testConstants';
import { addMessage, addUserToGroup, createGroupChat, deleteMessage, getGroupMessages, getUserMessages, removeUserFromGroup } from '../src/messages';
import { Message } from '../src/models';

const sandbox = sinon.createSandbox();

describe('Create Group Chat', () => {
    afterEach(() => {
      sandbox.restore();
    });
    
    it('When DynamoDB put is successful', async () => {
      const returnValueMock = {
          promise () {
            return {
              Item: sampleGroupChat,
            };
          },
        } as unknown as Request <DocumentClient.PutItemOutput, AWSError>;
              
        const stub = sandbox.stub(DocumentClient.prototype, 'put').returns(returnValueMock);

        const result = await createGroupChat(sampleGroupChat.name, sampleGroupChat.event_id, sampleGroupChat.user_ids);
        
        const output = sampleGroupChat
        if (result) {
            output.groupId = result.groupId
        }
        expect(result).toEqual(output);
    });
  
    it('When DynamoDB put fails', async () => {
        const returnValueMock = {
            promise () {
              return {
                Item: sampleGroupChat,
              };
            },
          } as unknown as Request <DocumentClient.PutItemOutput, AWSError>;
                              
        const stub = sandbox.stub(DocumentClient.prototype, 'put').throwsException("Event cannot be created");
  
        const result = await createGroupChat(sampleGroupChat.name, sampleGroupChat.event_id, sampleGroupChat.user_ids);
        expect(result).toBeNull();
    });
});


describe('Add Message to Group Chat', () => {
    afterEach(() => {
        sandbox.restore();
    });

    it('When DynamoDB put is successful', async () => {
        const returnValueMock = {
            promise () {
            return {
                Item: sampleMessage,
            };
            },
        } as unknown as Request <DocumentClient.PutItemOutput, AWSError>;
                
        const stub = sandbox.stub(DocumentClient.prototype, 'put').returns(returnValueMock);

        const result = await addMessage(sampleMessage.groupId, sampleMessage.userId, sampleMessage.content);

        const output = sampleMessage
        if (result) {
            output.messageId = result.messageId
            output.timestamp = result.timestamp
        }
        expect(result).toEqual(output);
    });

    it('When DynamoDB put fails', async () => {
        const returnValueMock = {
            promise () {
                return {
                Item: sampleMessage,
                };
            },
            } as unknown as Request <DocumentClient.PutItemOutput, AWSError>;
                                
        const stub = sandbox.stub(DocumentClient.prototype, 'put').throwsException("Message cannot be created");

        const result = await addMessage(sampleMessage.groupId, sampleMessage.userId, sampleMessage.content);
        expect(result).toBeNull();
    });
});

describe('Delete Message', () => {
    afterEach(() => {
        sandbox.restore();
    });

    it('When DynamoDB delete is successful', async () => {
        const returnValueMock = {
            promise () {
            return {
                Item: sampleMessage,
            };
            },
        } as unknown as Request <DocumentClient.DeleteItemOutput, AWSError>;
                
        const stub = sandbox.stub(DocumentClient.prototype, 'delete').returns(returnValueMock);

        const result = await deleteMessage(sampleMessage.messageId);

        expect(result).toEqual("Message deleted successfully");
    });

    it('When DynamoDB delete fails', async () => {
        const returnValueMock = {
            promise () {
                return {
                Item: sampleMessage,
                };
            },
            } as unknown as Request <DocumentClient.DeleteItemOutput, AWSError>;
                                
        const stub = sandbox.stub(DocumentClient.prototype, 'delete').throwsException("Message cannot be deleted");

        const result = await deleteMessage(sampleMessage.messageId);
        expect(result).toBeNull();
    });
});


describe('Get Messages of a Group Chat', () => {
    afterEach(() => {
        sandbox.restore();
    });

    it('When DynamoDB scan is successful', async () => {
        const output: Message[] = [sampleMessage, sampleMessage, sampleMessage, sampleMessage]

        const returnValueMock = {
            promise () {
            return {
                Items: output,
            };
            },
        } as unknown as Request <DocumentClient.ScanOutput, AWSError>;
                
        const stub = sandbox.stub(DocumentClient.prototype, 'scan').returns(returnValueMock);

        const result = await getGroupMessages(sampleMessage.groupId);

        expect(result).toEqual(output);
    });

    it('When DynamoDB scan fails', async () => {
        const returnValueMock = {
            promise () {
                return {
                    Items: [sampleMessage, sampleMessage, sampleMessage, sampleMessage],
                };
            },
            } as unknown as Request <DocumentClient.ScanOutput, AWSError>;
                                
        const stub = sandbox.stub(DocumentClient.prototype, 'scan').throwsException("Messages cannot be found; check group id");

        const result = await getGroupMessages(sampleMessage.groupId);
        expect(result).toBeNull();
    });
});


describe('Get Messages of a User', () => {
    afterEach(() => {
        sandbox.restore();
    });

    it('When DynamoDB scan is successful', async () => {
        const output: Message[] = [sampleMessage, sampleMessage, sampleMessage, sampleMessage]

        const returnValueMock = {
            promise () {
            return {
                Items: output,
            };
            },
        } as unknown as Request <DocumentClient.ScanOutput, AWSError>;
                
        const stub = sandbox.stub(DocumentClient.prototype, 'scan').returns(returnValueMock);

        const result = await getUserMessages(sampleMessage.userId);

        expect(result).toEqual(output);
    });

    it('When DynamoDB scan fails', async () => {
        const output: Message[] = [sampleMessage, sampleMessage, sampleMessage, sampleMessage]

        const returnValueMock = {
            promise () {
                return {
                    Items: output,
                };
            },
            } as unknown as Request <DocumentClient.ScanOutput, AWSError>;
                                
        const stub = sandbox.stub(DocumentClient.prototype, 'scan').throwsException("Messages cannot be found; check user id");

        const result = await getUserMessages(sampleMessage.userId);
        expect(result).toBeNull();
    });
});

describe('Add a User to a Group Chat', () => {
    afterEach(() => {
        sandbox.restore();
    });

    it('When DynamoDB update is successful', async () => {
        const returnValueMock = {
            promise () {
            return {
                Item: sampleUser,
            };
            },
        } as unknown as Request <DocumentClient.UpdateItemOutput, AWSError>;
                
        const stub = sandbox.stub(DocumentClient.prototype, 'update').returns(returnValueMock);

        const result = await addUserToGroup(sampleMessage.userId, sampleMessage.groupId);

        expect(result).toEqual("User added to group chat successfully");
    });

    it('When DynamoDB update fails', async () => {
        const returnValueMock = {
            promise () {
                return {
                    Item: sampleUser,
                };
            },
            } as unknown as Request <DocumentClient.UpdateItemOutput, AWSError>;
                                
        const stub = sandbox.stub(DocumentClient.prototype, 'update').throwsException("Error adding user to a group; check user id and group id");

        const result = await addUserToGroup(sampleMessage.userId, sampleMessage.groupId);
        expect(result).toBeNull();
    });
});

describe('Remove a User to a Group Chat', () => {
    afterEach(() => {
        sandbox.restore();
    });

    it('When DynamoDB update is successful', async () => {
        const returnGetMock = {
            promise () {
            return {
                Item: sampleGroupChat,
            };
            },
        } as unknown as Request <DocumentClient.GetItemOutput, AWSError>;
                
        sandbox.stub(DocumentClient.prototype, 'get').returns(returnGetMock);

        const returnValueMock = {
            promise () {
            return {
                Item: sampleUser,
            };
            },
        } as unknown as Request <DocumentClient.UpdateItemOutput, AWSError>;
                
        const stub = sandbox.stub(DocumentClient.prototype, 'update').returns(returnValueMock);

        const result = await removeUserFromGroup(sampleMessage.userId, sampleMessage.groupId);
        expect(result).toBeNull();
    });

    it('When Group Chat does not exist', async () => {
        const returnGetMock = {
            promise () {
            return {
                Item: false, // simulating 'null' w/o ts-ignore!
            };
            },
        } as unknown as Request <DocumentClient.GetItemOutput, AWSError>;
                
        sandbox.stub(DocumentClient.prototype, 'get').returns(returnGetMock);
        const returnValueMock = {
            promise () {
                return {
                    Item: sampleUser,
                };
            },
            } as unknown as Request <DocumentClient.UpdateItemOutput, AWSError>;
                                
        const stub = sandbox.stub(DocumentClient.prototype, 'update').returns(returnValueMock);

        const result = await removeUserFromGroup(sampleMessage.userId, sampleMessage.groupId);
        expect(result).toEqual("Group chat not found");
    });

    it('When DynamoDB get succeeds (group exists), but DynamoDB update fails', async () => {
        const returnGetMock = {
            promise () {
            return {
                Item: sampleGroupChat,
            };
            },
        } as unknown as Request <DocumentClient.GetItemOutput, AWSError>;
                
        sandbox.stub(DocumentClient.prototype, 'get').returns(returnGetMock);

        const returnValueMock = {
            promise () {
                return {
                    Item: sampleUser,
                };
            },
            } as unknown as Request <DocumentClient.UpdateItemOutput, AWSError>;
                                
        const stub = sandbox.stub(DocumentClient.prototype, 'update').throwsException("Error removing user to a group; check user id and group id");

        const result = await removeUserFromGroup(sampleMessage.userId, sampleMessage.groupId);
        expect(result).toEqual("Error removing user from group chat");
    });

    it('When DynamoDB get fails', async () => {
        const returnGetMock = {
            promise () {
            return {
                Item: sampleGroupChat,
            };
            },
        } as unknown as Request <DocumentClient.GetItemOutput, AWSError>;

        const stub = sandbox.stub(DocumentClient.prototype, 'get').throwsException("Error finding group; check group id");

        const result = await removeUserFromGroup(sampleMessage.userId, sampleMessage.groupId);
        expect(result).toEqual("Error removing user from group chat");
    });
});