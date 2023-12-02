import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import axios from 'axios';
import { Provider, useSelector } from 'react-redux';
import configureStore from 'redux-mock-store';
import AttendingUser from '../../Shared/AttendingUser';

// Mock axios module
jest.mock('axios');

// Mock the useDispatch and useSelector hooks
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

const mockStore = configureStore();

describe('AttendingUser Component', () => {
  test('renders AttendingUser component for different scenarios', async () => {
    const mockUser = {
      userId: 'mockUserId',
      firstName: 'John',
      lastName: 'Doe',
      profilePictureUrl: 'https://example.com/profile.jpg',
      friends: ['friendUserId'],
      requests: {
        outgoing: ['pendingUserId'],
      },
    };

    const mockAttendingUser = {
      userId: 'attendingUserId',
      firstName: 'Jane',
      lastName: 'Smith',
      profilePictureUrl: 'https://example.com/attendingProfile.jpg',
    };

    useSelector.mockReturnValue(mockUser);

    axios.get.mockResolvedValueOnce({ data: mockAttendingUser });

    const store = mockStore({
      user: mockUser,
    });

    // Render the component within the Redux Provider
    const { getByText, getByTestId } = render(
      <Provider store={store}>
        <AttendingUser userId="attendingUserId" ownerId="ownerUserId" navigation={{ navigate: jest.fn() }} />
      </Provider>
    );

    // Wait for asynchronous calls to resolve
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('users/attendingUserId'));
    });

    // Verify that the component renders with the expected data
    expect(getByText('Jane Smith')).toBeTruthy();
    // expect(getByTestId('user-plus-icon')).toBeTruthy(); // Add friend button is rendered

    // Simulate adding a friend
    // act(() => {
    //   fireEvent.press(getByTestId('user-plus-icon'));
    // });

    // Wait for the asynchronous friend request
    // await waitFor(() => {
    //   expect(axios.post).toHaveBeenCalledTimes(1);
    // });

    // Ensure that the Redux store is updated and the pending state is rendered
    // const actions = store.getActions();
    // expect(actions).toContainEqual(setUserInfo(expect.objectContaining({ requests: { outgoing: ['pendingUserId', 'attendingUserId'] } })));
    // expect(getByText('pending')).toBeTruthy();
  });

  // Add more test cases for different scenarios (e.g., being friends, pending requests, etc.)
});
