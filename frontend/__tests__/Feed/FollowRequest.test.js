import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import FollowRequest from '../../Screens/Feed/Notifications/FollowRequest';

// Mock the Axios library
import axios from 'axios';
jest.mock('axios');

// Mock Redux store and actions
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

const mockRequester = {
  userId: 'mockUserId',
  firstName: 'John',
  lastName: 'Doe',
  // ... other properties
};

const mockStore = configureStore([]);

describe('FollowRequest Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
  });

  test('renders correctly', async () => {
    // Mock the axios.get call
    axios.get.mockResolvedValue(mockRequester);

    const consoleSpy = jest.spyOn(console, 'log');

    const { getByText, getByTestId } = render(
        <Provider store={store}>
             <FollowRequest requesterId={mockRequester.userId} />
        </Provider>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalled());

    // Ensure that the component renders with the requester's name
    expect(getByText(`${mockRequester.firstName} ${mockRequester.lastName}`)).toBeTruthy();

    // Trigger accept friend request action
    fireEvent.press(getByTestId('acceptFriendButton'));

    // Allow promises to resolve
    await waitFor(() => expect(axios.get).toHaveBeenCalled());

    // Check if the Redux action is dispatched
    expect(consoleSpy).toHaveBeenCalledWith('Friend Request Accepted!');

    consoleSpy.mockRestore();
  });

  test('handles deny friend request correctly', async () => {
    // Mock the axios.get call
    axios.get.mockResolvedValue(mockRequester);

    // Mock the axios.post call for denying friend request
    axios.post.mockResolvedValue({
      status: 200,
      data: {
        requesterId: '123',
        requestId: '456'
      },
    });

    const consoleSpy = jest.spyOn(console, 'log');

    const { getByTestId } = render(
        <Provider store={store}>
            <FollowRequest requesterId={mockRequester.userId} />
        </Provider>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalled());

    // Trigger deny friend request action
    fireEvent.press(getByTestId('denyFriendButton'));

    // Allow promises to resolve
    await waitFor(() => {});

    // Check if the Redux action is dispatched
    expect(consoleSpy).toHaveBeenCalledWith('Friend Request successfully DENIED!');

    consoleSpy.mockRestore();
  });
});
