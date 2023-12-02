import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import axios from 'axios';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import SavedEvents from '../../Screens/SavedEvents/SavedEvents';
import { useSelector } from 'react-redux';

// Mock the useSelector and useDispatch hooks from react-redux
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

// Mock axios.get
jest.mock('axios');

// Mocking the Redux store
const mockStore = configureStore([]);

describe('SavedEvents Component', () => {
  test('renders the component correctly with saved events', async () => {
    // Mock the useSelector return value
    const mockUser = {
      userId: 'yourUserId', // Replace with your actual userId
      eventsSaved: [{ eventId: 1, title: 'Event 1' }], // Replace with your saved events data
    };

    useSelector.mockReturnValue(mockUser);

    // Mock axios.get implementation
    axios.get.mockResolvedValue({
      data: [{ eventId: 1, title: 'Event 1' }], // Replace with your mock data
    });

    // Render the component within a mocked Redux store
    const store = mockStore({
      user: mockUser, // Replace with your actual Redux state structure
    });

    const { getByText } = render(
      <Provider store={store}>
        <SavedEvents />
      </Provider>
    );

    expect(getByText('Saved Events')).toBeTruthy();

    // Wait for the API call to finish
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

    // Ensure that the component renders the saved events
    // expect(getByText('Event 1')).toBeTruthy(); // Adjust based on your actual event data
    // Add more assertions based on your component's structure
  });

  test('renders the component correctly with no saved events', async () => {
    // Mock the useSelector return value with no saved events
    const mockUser = {
      userId: 'yourUserId', // Replace with your actual userId
      eventsSaved: [], // No saved events
    };

    useSelector.mockReturnValue(mockUser);

    // Mock axios.get implementation with an empty array
    axios.get.mockResolvedValue({
      data: [], // No saved events
    });

    // Render the component within a mocked Redux store
    const store = mockStore({
      user: mockUser, // Replace with your actual Redux state structure
    });

    const { getByText } = render(
      <Provider store={store}>
        <SavedEvents />
      </Provider>
    );

    // Wait for the API call to finish
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

    // Ensure that the component renders the "no saved events" message
    expect(getByText('Saved Events')).toBeTruthy();
    expect(getByText('no saved events!')).toBeTruthy();
    // Add more assertions based on your component's structure
  });

  // Add more test cases as needed
});
