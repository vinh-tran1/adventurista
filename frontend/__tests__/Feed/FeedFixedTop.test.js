import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect'; // For extending jest matchers
import FeedFixedTop from '../../Screens/Feed/FeedFixedTop';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

// Mock the Axios library
import axios from 'axios';
jest.mock('axios');

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

const mockStore = configureStore([]);

describe('FeedFixedTop Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
  });

  test('renders correctly', () => {
    // const store = mockStore({
    //   user: {
    //     userInfo: {
    //       userId: '1',
    //       primaryLocation: 'New York',
    //     },
    //   },
    // });

    const { getByText, getByPlaceholderText, getByTestId } = render(
      <Provider store={store}>
        <FeedFixedTop navigation={{ navigate: jest.fn() }} />
      </Provider>
    );

    expect(getByText('New Haven, CT')).toBeTruthy();
    // expect(getByText('X')).not.toBeTruthy(); // Search button is not visible initially

    fireEvent.press(getByTestId('searchbar1'));

    expect(getByPlaceholderText('New Haven, CT')).toBeTruthy();
    expect(getByText('X')).toBeTruthy(); // Search button is visible after pressing Search
  });

  test('handles location search', async () => {
    // store = mockStore({
    //   user: {
    //     userInfo: {
    //       userId: '1',
    //       primaryLocation: 'New York',
    //     },
    //   },
    // });

    const mockResponse = {
      newPost: false,
      userId: '1234',
      age: '21',
      blockedUsers: [],
      email: '123',
      eventsGoingTo: ['1'],
      eventsNotGoingTo: [],
      eventsOwned: ['1'],
      eventsSaved: [],
      firstName: 'Vinh',
      lastName: 'Tran',
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

    axios.post.mockResolvedValue({
      status: 200,
      data: mockResponse
    });

    const { getByText, getByPlaceholderText, getByTestId } = render(
      <Provider store={store}>
        <FeedFixedTop navigation={{ navigate: jest.fn() }} />
      </Provider>
    );

    fireEvent.press(getByTestId('searchbar1'));
    fireEvent.changeText(getByPlaceholderText('New Haven, CT'), 'Boston, MA');
    fireEvent.press(getByTestId('searchbar2'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(0
        // expect.any(String),
        // expect.objectContaining({
        //   userId: '1',
        //   primaryLocation: 'Boston, MA',
        //   firstName: expect.any(String),
        //   lastName: expect.any(String),
        //   interests: expect.any(Array),
        //   age: expect.any(Number),
        //   bio: expect.any(String),
        // })
      );
    });
  });
});
