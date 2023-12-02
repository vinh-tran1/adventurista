import React from 'react';
import { render, waitFor, fireEvent, act } from '@testing-library/react-native';
import axios from 'axios';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faLocationDot, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import EventCard from '../../Shared/EventCard';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

const mockNavigate = jest.fn();
const mockConsoleLog = jest.spyOn(console, 'log');

jest.mock('axios');

const mockStore = configureStore([]);

describe('EventCard Component', () => {
  beforeAll(() => {
    library.add(faUser, faLocationDot, faRightFromBracket);
  });

  test('renders the component correctly', async () => {
    const mockEvent = {
      postingUserId: 'posterUserId',
      eventPictureUrl: 'https://example.com/image.jpg',
      title: 'Event Title',
      location: 'Event Location',
      whoIsGoing: [{ userId: 'userId1' }, { userId: 'userId2' }],
      date: '2023-01-01',
      time: '12:00 PM',
    };

    const mockUser = {
      userId: 'yourUserId',
    };

    useSelector.mockReturnValue(mockUser);

    axios.get.mockResolvedValue({
      data: { firstName: 'PosterFirstName' },
    });

    const store = mockStore({
      user: mockUser,
    });

    // Render the component within a mocked Redux store
    const { getByText, getByTestId } = render(
      <Provider store={store}>
        <EventCard event={mockEvent} privacy={false} navigation={{navigate: mockNavigate}}/>
      </Provider>
    );

    // Use act to wait for the component to update state
    await act(async () => {
      // Wait for the API call to finish
      await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    });

    // Ensure that the component renders the event details
    expect(getByText('Event Title')).toBeTruthy();
    expect(getByText('Event Location')).toBeTruthy();
    expect(getByText('+ 2 Others')).toBeTruthy();
    expect(getByText('by PosterFirstName')).toBeTruthy();
    expect(getByText('2023-01-01')).toBeTruthy();
    expect(getByText('12:00 PM')).toBeTruthy();

    // Simulate press event to navigate
    fireEvent.press(getByTestId('navButton'));

    // Check if navigation function is called with the correct parameters
    expect(mockNavigate).toHaveBeenCalledWith('Event Details', {
      event: mockEvent,
      poster: { firstName: 'PosterFirstName' },
      privacy: false,
    });
  });

  test('handles error in API request', async () => {
    const mockEvent = {
      postingUserId: 'posterUserId',
      eventPictureUrl: 'https://example.com/image.jpg',
      title: 'Event Title',
      location: 'Event Location',
      whoIsGoing: [{ userId: 'userId1' }, { userId: 'userId2' }],
      date: '2023-01-01',
      time: '12:00 PM',
    };

    const mockUser = {
      userId: 'yourUserId',
    };

    useSelector.mockReturnValue(mockUser);

    axios.get.mockRejectedValue(new Error('Failed to fetch data'));

    const store = mockStore({
      user: mockUser,
    });

    // Render the component within a mocked Redux store
    const { getByText } = render(
      <Provider store={store}>
        <EventCard event={mockEvent} privacy={false} navigation={{ navigate: mockNavigate }} />
      </Provider>
    );

   // Use act to wait for the component to update state
   await act(async () => {
    // Wait for the API call to finish and the error to be logged
    // You might need to adjust the timing or use Jest timers for this
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });

  // Check if console.log was called with the expected error message
  expect(mockConsoleLog).toHaveBeenCalledWith('event card error');
  });

});
