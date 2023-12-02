import React from 'react';
import { render, act, fireEvent, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faLocationDot, faRightFromBracket, faCheck, faCalendarPlus, faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import EventDetails from '../../Shared/EventDetails';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('axios');

const mockStore = configureStore([]);

describe('EventDetails Component', () => {
  beforeAll(() => {
    library.add(faUser, faLocationDot, faRightFromBracket, faCheck, faCalendarPlus, faCaretLeft);
  });

  test('renders the component correctly and handles attending an event', async () => {
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
      eventsGoingTo: ['eventId2'],
    };

    const updatedUser = {
      ...mockUser,
      eventsGoingTo: [...mockUser.eventsGoingTo, 'eventId1'],
    };

    const mockDispatch = jest.fn();
    const mockNavigate = jest.fn();

    axios.post.mockResolvedValue({
      status: 200,
      data: updatedUser,
    });

    useSelector.mockReturnValue(mockUser);
    useDispatch.mockReturnValue(mockDispatch);

    const store = mockStore({
      user: mockUser,
    });

    // Render the component within a mocked Redux store
    const { getByText, getByTestId } = render(
      <Provider store={store}>
        <EventDetails navigation={{ navigate: mockNavigate }} route={{ params: { event: mockEvent, poster: { firstName: 'PosterFirstName' }, privacy: true } }} />
      </Provider>
    );

    // Ensure that the component renders the event details
    expect(getByText('Event Title')).toBeTruthy();
    expect(getByText('Event Location')).toBeTruthy();
    expect(getByText('by PosterFirstName')).toBeTruthy();
    expect(getByText('2023-01-01')).toBeTruthy();
    expect(getByText('12:00 PM')).toBeTruthy();

    // Check if the "Attending" section is displayed correctly
    expect(getByText('Attending (2)')).toBeTruthy();
    expect(getByText('Join Event to See Details!')).toBeTruthy(); // User is already attending

    // Simulate press event to attend the event
    fireEvent.press(getByTestId('attendButton'));

    // Wait for the API call to finish and the dispatch to be called
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(mockDispatch).toHaveBeenCalledTimes(0));

    // Check if the component updates after attending the event
    // expect(getByText('Attending (3)')).toBeTruthy();
  });
});
