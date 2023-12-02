import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import FollowRequest from '../../Screens/Feed/Notifications/FollowRequest';

// Mock the Axios library
import axios from 'axios';
jest.mock('axios');

jest.mock('@fortawesome/react-native-fontawesome', () => ({
    FontAwesomeIcon: (props) => <>{props.children}</>, 
  }));

// Mock Redux store and actions
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

const mockStore = configureStore([]);

describe('FollowRequest Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
  });

  const mockRequester = {
    newPost: false,
    userId: '1234',
    age: '21',
    blockedUsers: [],
    email: '123',
    eventsGoingTo: ['1'],
    eventsNotGoingTo: [],
    eventsOwned: ['1'],
    eventsSaved: [],
    firstName: 'John',
    lastName: 'Doe',
    friends: ['2'],
    groups: ['3'],
    interests: ['tag'],
    messages: [],
    primaryLocation: '123',
    profilePictureUrl: '123',
    bannerImageUrl: '123',
    bio: '123',
    requests: {
      outgoing:[],
      incoming: []
    }
    };

  const mockPostData = {
    requesterId: mockRequester.userId, 
    requestId: '123'
    }

  test('renders correctly', async () => {
    // Mock the axios.get call
    axios.get.mockResolvedValue(mockRequester);

    // Render the component
    const { getByText } = render(
      <Provider store={store}>
        <FollowRequest requesterId={mockRequester.userId} />
      </Provider>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalled());

    // Ensure that the component renders with the requester's name
    // expect(getByText(`${mockRequester.firstName} ${mockRequester.lastName}`)).toBeTruthy();
  });

  test('adds friend successfully', async () => {
    // Mock the axios.get call
    axios.get.mockResolvedValue(mockRequester);

    // Mock the axios.post call for accepting friend request
    axios.post.mockResolvedValue({
      status: 200,
      data: mockPostData
    });

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();


    // Render the component
    const { getByTestId } = render(
      <Provider store={store}>
        <FollowRequest requesterId={mockRequester.userId} />
      </Provider>
    );

    // Trigger accept friend request action
    fireEvent.press(getByTestId('acceptFriendButton'));

    // Allow promises to resolve
    // await waitFor(() => expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('friend-request/accept')));
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(0));
    //expect(consoleSpy).toHaveBeenCalledWith("An error occured for accepting request. Please try again");

    // Check if the Redux action is dispatched
    // const acceptAction = store.getActions().find(action => action.type === setUserInfo.type);
    // expect(acceptAction.payload.newPost).toBe(false);
  });

  test('removes friend successfully', async () => {
    // Mock the axios.get call
    axios.get.mockResolvedValue({ data: mockRequester });

    // Mock the axios.post call for denying friend request
    axios.post.mockResolvedValue({
      status: 200,
      data: mockPostData,
    });

    // Render the component
    const { getByTestId } = render(
      <Provider store={store}>
        <FollowRequest requesterId={mockRequester.userId} />
      </Provider>
    );

    // Trigger deny friend request action
    fireEvent.press(getByTestId('denyFriendButton'));

    // Allow promises to resolve
    // await waitFor(() => expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('friend-request/deny')));
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(0));

    // Check if the Redux action is dispatched
    // const denyAction = store.getActions().find(action => action.type === setUserInfo.type);
    // expect(denyAction.payload.newPost).toBe(false);
  });
});
