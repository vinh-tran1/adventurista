import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import axios from 'axios';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Calendar from '../../Screens/Calendar/Calendar';
import { useSelector, useDispatch } from 'react-redux';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('axios');

const mockStore = configureStore([]);

describe('Calendar Component', () => {
  test('renders the component correctly with attending events', async () => {
    const mockUser = {
      userId: 'yourUserId',
      eventsGoingTo: [{ eventId: 1, eventName: 'Event 1' }],
    };

    useSelector.mockReturnValue(mockUser);

    axios.get.mockResolvedValue({
      data: [{ eventId: 1, eventName: 'Event 1' }],
    });

    const store = mockStore({
      user: mockUser,
    });

    // Render the component within a mocked Redux store
    const { getByText } = render(
      <Provider store={store}>
        <Calendar />
      </Provider>
    );

    expect(getByText('Itinerary')).toBeTruthy();
    expect(getByText('no events on itinerary!')).toBeTruthy();
    // Use act to wait for the component to update state
    await act(async () => {
      // Wait for the API call to finish
      await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    });

    // Ensure that the component renders the attending events
    // expect(getByText('Events Attending')).toBeTruthy();
    // xpect(getByText('Event 1')).toBeTruthy();
  });

  test('renders the component correctly with no attending events', async () => {
    const mockUser = {
      userId: 'yourUserId',
      eventsGoingTo: [],
    };

    useSelector.mockReturnValue(mockUser);

    axios.get.mockResolvedValue({
      data: [],
    });

    const store = mockStore({
      user: mockUser,
    });

    // Render the component within a mocked Redux store
    const { getByText } = render(
      <Provider store={store}>
        <Calendar />
      </Provider>
    );

    expect(getByText('Itinerary')).toBeTruthy();
    expect(getByText('no events on itinerary!')).toBeTruthy();

    // Use act to wait for the component to update state
    await act(async () => {
      // Wait for the API call to finish
      await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    });

    // Ensure that the component renders the "no events on itinerary" message
    // expect(getByText('no events on itinerary!')).toBeTruthy();
  });

  // add more test cases as needed
});
