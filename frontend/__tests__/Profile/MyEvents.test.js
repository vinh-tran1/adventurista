import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faLocationDot, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import MyEvents from '../../Screens/Profile/MyEvents';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

jest.mock('axios');

const mockStore = configureStore([]);

describe('MyEvents Component', () => {
  beforeAll(() => {
    library.add(faUser, faLocationDot, faRightFromBracket);
  });

  test('renders the component correctly', async () => {
    const mockEvent = {
      eventId: 'eventId1',
      eventPictureUrl: 'https://example.com/image.jpg',
      title: 'Event Title',
      location: 'Event Location',
      whoIsGoing: ['userId1', 'userId2'],
      date: '2023-01-01',
      time: '12:00 PM',
      postingUserId: 'posterUserId',
    };

    const mockUser = {
      userId: 'yourUserId',
      eventsOwned: ['eventId1'],
    };

    useSelector.mockReturnValue(mockUser);

    axios.get.mockResolvedValue({
      status: 200,
      data: mockEvent,
    });

    const store = mockStore({
      user: mockUser,
    });

    // Render the component within a mocked Redux store
    const { getByText } = render(
      <Provider store={store}>
        <MyEvents eventId={mockEvent.eventId} />
      </Provider>
    );

    // Wait for the API call to finish
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

    // Ensure that the component renders the EventCard correctly
    expect(getByText('Event Title')).toBeTruthy();
    expect(getByText('Event Location')).toBeTruthy();
    expect(getByText('by')).toBeTruthy();
    expect(getByText('2023-01-01')).toBeTruthy();
    expect(getByText('12:00 PM')).toBeTruthy();
  });
  
  test('renders the component correctly and handles API call errors', async () => {
    const mockEvent = {
      eventId: 'eventId1',
      eventPictureUrl: 'https://example.com/image.jpg',
      title: 'Event Title',
      location: 'Event Location',
      whoIsGoing: ['userId1', 'userId2'],
      date: '2023-01-01',
      time: '12:00 PM',
      postingUserId: 'posterUserId',
    };

    const mockUser = {
      userId: 'yourUserId',
      eventsOwned: ['eventId1'],
    };

    const mockConsoleLog = jest.spyOn(console, 'log');

    useSelector.mockReturnValue(mockUser);

    // Mocking a failed API call
    axios.get.mockRejectedValue(new Error('Failed to fetch data'));

    const store = mockStore({
      user: mockUser,
    });

    // Render the component within a mocked Redux store
    const { getByText } = render(
      <Provider store={store}>
        <MyEvents eventId={mockEvent.eventId} />
      </Provider>
    );

    // Wait for the API call to finish
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

    // Ensure that console.log is called with the expected error message
    expect(mockConsoleLog).toHaveBeenCalledWith('my event error');
  });

});
