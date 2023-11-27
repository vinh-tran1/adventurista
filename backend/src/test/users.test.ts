// @ts-nocheck
test('Get User (User does exist)', () => {

});

test('Get User (User does NOT exist)', () => {

});

import { getUser } from '../src/users';
import { User } from '../src/models';
import { DynamoDB } from 'aws-sdk';

// // Mock the AWS SDK DynamoDB DocumentClient
// jest.mock('aws-sdk', () => {
//   const mockDocumentClient = {
//     get: jest.fn(),
//   };

//   return {
//     DynamoDB: {
//       DocumentClient: jest.fn(() => mockDocumentClient),
//     },
//   };
// });

// describe('getUser', () => {
//   const mockDocumentClient = new DynamoDB.DocumentClient() as jest.Mocked<DynamoDB.DocumentClient>;
//   const userId = 'testUserId';

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should return the user from DynamoDB', async () => {
//     const expectedUser: User = {
//         email: "test@test.edu",
//         userId: userId,
//         firstName: "Bob",
//         lastName: "Joe",
//         hashedPassword: "NotAPassword123",
//         primaryLocation: "",
//         blockedUsers: [],
//         interests: [],
//         friends: [],
//         requests: {
//           outgoing: [],
//           incoming: [],
//         },
//         groups: [],
//         eventsSeen: [],
//         eventsSaved: [],
//         eventsOwned: [],
//         eventsGoingTo: [],
//         eventsNotGoingTo: [],
//         messages: [],
//         profilePictureUrl: "",
//         bio: "",
//         bannerImageUrl: "",
//         age: 0,
//       };

//     // Mock the DynamoDB DocumentClient get method
//     mockDocumentClient.get.mockReturnValueOnce({
//       promise: jest.fn().mockReturnValueOnce({
//         Item: expectedUser,
//       }),
//     });

//     const result = await getUser(userId);

//     expect(result).toEqual(expectedUser);

//     // Verify that the DynamoDB DocumentClient get method was called with the correct parameters
//     expect(mockDocumentClient.get).toHaveBeenCalledWith({
//       TableName: 'YourUsersTableName',
//       Key: {
//         userId: userId,
//       },
//     });
//   });
// });

// // import { USERS_TABLE_NAME } from '../src/constants';
// // import { getUser } from '../src/users';
// // import { DynamoDB } from 'aws-sdk';
// // import { AWSError, Request } from 'aws-sdk';
// // import { GetItemOutput } from 'aws-sdk/clients/dynamodb';

// // // Mock the AWS SDK DynamoDB methods
// // jest.mock('aws-sdk', () => {
// //   const mockDocumentClient = {
// //     get: jest.fn(),
// //   };

// //   return {
// //     DynamoDB: {
// //       DocumentClient: jest.fn(() => mockDocumentClient),
// //     },
// //   };
// // });

// // describe('getItemFromDynamoDB', () => {
// //   const mockDocumentClient = new DynamoDB.DocumentClient() as jest.Mocked<DynamoDB.DocumentClient>;
// //   //const tableName = USERS_TABLE_NAME;
// //   const key = { userId: 'randomUserId' };

// //   afterEach(() => {
// //     jest.clearAllMocks();
// //   });

// // it('should return the item from DynamoDB', async () => {
// //     const expectedResult = { yourAttribute: 'someData' };
// //     process.env.USERS_TABLE_NAME = "users";

// //     // Mock the DynamoDB get method
// //     mockDocumentClient.get.mockReturnValueOnce({
// //         promise: jest.fn().mockResolvedValue(expectedResult),
// //     } as unknown as Request<GetItemOutput, AWSError>);

// //     const result = await getUser("randomUserId");

// //     expect(result).toEqual(expectedResult);

// //     // Verify that the DynamoDB get method was called with the correct parameters
// // });
// // });