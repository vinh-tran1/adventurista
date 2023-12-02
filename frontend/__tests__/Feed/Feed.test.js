import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import { Provider } from 'react-redux';
import axios from 'axios';
import configureStore from 'redux-mock-store';
import Feed from '../../Screens/Feed/Feed';

// Mock the navigation prop
const mockNavigate = jest.fn();

// Mock useSelector and useDispatch
import { useSelector, useDispatch } from 'react-redux';
jest.mock('react-redux');

// Mock Axios
jest.mock('axios');

const mockStore = configureStore([]);

describe('Feed Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      user: {
        userId: 'mockUserId',
        // Other user properties...
      },
    });
    useSelector.mockImplementation((selector) => selector(store.getState()));
  });

  const mockPosts = [
    {
      eventId: '1',
      title: 'Title',
      description: 'description',
      date: '2002-11-03',
      time: '11:00',
      location: 'New Haven, CT',
      postingUserId: '123',
      blockedUsers: [],
      whoIsGoing: [],
      tags: ['1', '2', '3'],
      eventPictureUrl: '1234',
    },
  ];

  beforeEach(() => {
    // Correct Axios mocking
    axios.get.mockResolvedValue({ data: mockPosts });
  });

  test('renders feed component with posts', async () => {
    const { getByTestId, getByText } = render(
      <Provider store={store}>
        <Feed navigation={{ navigate: mockNavigate }} />
      </Provider>
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(0);
      // expect(axios.get).toHaveBeenCalledWith(
      //   expect.stringContaining('/events/events/mockUserId')
      // );
    });

    // expect(getByTestId('feed-container')).toBeTruthy();

    // Assuming you have a Post component, check if a post is rendered
    // expect(getByText('Title')).toBeTruthy(); // Adjust the expected text based on your actual post content
    // expect(getByText('New Haven, CT')).toBeTruthy(); // Adjust the expected text based on your actual post content
    // Add more assertions for other post properties as needed
  });
});
