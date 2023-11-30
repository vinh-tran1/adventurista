import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect'; // For extending jest matchers
import axios from 'axios';
import FeedFixedTop from '../../Screens/Feed/FeedFixedTop';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

jest.mock('axios');

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

describe('FeedFixedTop Component', () => {
  const mockStore = configureStore([]);

  test('renders correctly', () => {
    const store = mockStore({
      user: {
        userInfo: {
          userId: '1',
          primaryLocation: 'New York',
        },
      },
    });

    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <FeedFixedTop navigation={{ navigate: jest.fn() }} />
      </Provider>
    );

    expect(getByText('New York')).toBeTruthy();
    expect(getByText('X')).not.toBeTruthy(); // Search button is not visible initially

    fireEvent.press(getByText('Search'));

    expect(getByPlaceholderText('New Haven, CT')).toBeTruthy();
    expect(getByText('X')).toBeTruthy(); // Search button is visible after pressing Search
  });

  test('handles location search', async () => {
    const store = mockStore({
      user: {
        userInfo: {
          userId: '1',
          primaryLocation: 'New York',
        },
      },
    });

    axios.post.mockResolvedValue({
      status: 200,
      data: {
        userId: '1',
        primaryLocation: 'New Haven, CT',
        // other user properties...
      },
    });

    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <FeedFixedTop navigation={{ navigate: jest.fn() }} />
      </Provider>
    );

    fireEvent.press(getByText('Search'));
    fireEvent.changeText(getByPlaceholderText('New Haven, CT'), 'New Haven, CT');
    fireEvent.press(getByText('Search'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        {
          userId: '1',
          primaryLocation: 'New Haven, CT',
          // other user properties...
        },
        expect.any(Object)
      );
    });
  });
});
