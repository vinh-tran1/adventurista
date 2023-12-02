import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import axios from 'axios';
import { Provider, useSelector } from 'react-redux';
import configureStore from 'redux-mock-store';
import UserBottom from '../../Screens/Feed/UserBottom';

// Mock axios module
jest.mock('axios');

// Mock the useDispatch and useSelector hooks
// Mock the useDispatch and useSelector hooks
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
  }));

const mockStore = configureStore();

describe('UserBottom Component', () => {
  test('renders UserBottom component with proper data and conditional rendering', async () => {
    const mockUser = {
      userId: 'mockUserId',
      firstName: 'John',
      lastName: 'Doe',
      age: 25,
      friends: ['friendUserId'],
      requests: {
        outgoing: ['requestedUserId'],
      },
      primaryLocation: 'New York',
    };

    const mockAttendingUser = {
      userId: 'attendingUserId',
      firstName: 'Jane',
      lastName: 'Smith',
      age: 30,
      friends: ['friendUserId', 'anotherFriendUserId'],
      primaryLocation: 'San Francisco',
    };

    useSelector.mockReturnValue(mockUser);

    axios.get.mockResolvedValueOnce({ data: mockAttendingUser });

    const store = mockStore({
      user: mockUser,
    });

    // Render the component within the Redux Provider
    const { getByText, getByTestId } = render(
      <Provider store={store}>
        <UserBottom userId="attendingUserId" update={false} navigation={{ navigate: jest.fn() }} />
      </Provider>
    );

    // Wait for asynchronous calls to resolve
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('users/attendingUserId'));
    });

    // Verify that the component renders with the expected data
    expect(getByText('Jane Smith')).toBeTruthy();
    expect(getByText('2 friends, 0 groups')).toBeTruthy();
    expect(getByText('from San Francisco')).toBeTruthy();

    // Verify that the conditional rendering works
    expect(getByTestId('user-plus-icon')).toBeTruthy(); // Add friend button is rendered

    // Simulate adding a friend
    act(() => {
      fireEvent.press(getByTestId('user-plus-icon'));
    });

    // Ensure that the component renders the "pending" state after the friend request
    // expect(getByText('pending')).toBeTruthy();
  });

  // Add more test cases for different scenarios (e.g., being friends, pending requests, etc.)
});
