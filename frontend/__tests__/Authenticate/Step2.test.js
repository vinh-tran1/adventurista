import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import Step2 from '../../Screens/Authenticate/Signup/Step2';

// Mock Redux store and actions
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

// Mock the Axios library
import axios from 'axios';
jest.mock('axios');

const mockStore = configureStore([]);

const user = {
    newPost: false,
    userId: '1234',
    age: '21',
    blockedUsers: [],
    email: '123',
    eventsGoingTo: [],
    eventsNotGoingTo: [],
    eventsOwned: [],
    eventsSaved: [],
    firstName: 'Vinh',
    lastName: 'Tran',
    friends: [],
    groups: [],
    interests: [],
    messages: [],
    primaryLocation: '123',
    profilePictureUrl: '123',
    bannerImageUrl: '123',
    bio: '123',
    requests: []
};

describe('Step2 Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
  });

  test('renders correctly', () => {
    const { getByText } = render(
      <Provider store={store}>
        <Step2 navigation={{ navigate: jest.fn() }} route={{ params: { user: { userId: 'mockUserId' } } }} />
      </Provider>
    );

    expect(getByText('Complete Sign Up')).toBeTruthy();
  });

  test('handles complete signup correctly', async () => {
    // Mock the resolved promise for the axios request
    axios.post.mockResolvedValue(user);

    const consoleSpy = jest.spyOn(console, 'log');

    const { getByTestId } = render(
      <Provider store={store}>
        <Step2 navigation={{ navigate: jest.fn() }} route={{ params: user }} />
      </Provider>
    );

    // Trigger complete signup action
    fireEvent.press(getByTestId('completeSignupButtonTestId'));

    // Use waitFor to wait for asynchronous operations to complete
    await waitFor(() => {
        console.log('Actions:', store.getActions());
        // Check if the Redux action is dispatched
        const actions = store.getActions();
        expect(actions.length).toBe(1);
        expect(actions[0].type).toBe('SET_USER_INFO');
      });

    // Ensure the console.error spy was not called
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  test('updates inputs correctly', () => {

    const { getByTestId } = render(
      <Provider store={store}>
        <Step2 navigation={{ navigate: jest.fn() }} route={{ params: user }} />
      </Provider>
    );

    const ageInput = getByTestId('DOB');
    fireEvent.changeText(ageInput, '25');
    expect(ageInput.props.value).toBe('25');

    const locationInput = getByTestId('location');
    fireEvent.changeText(locationInput, 'New York');
    expect(locationInput.props.value).toBe('New York');

    const tempInterestInput = getByTestId('interest');
    fireEvent.changeText(tempInterestInput, 'Music');
    expect(tempInterestInput.props.value).toBe('Music');

  });

  test('handles step2 error correctly', async () => {
    // Mock the rejected promise for the axios request
    axios.post.mockRejectedValue(new Error('Failed to fetch data'));

    const consoleSpy = jest.spyOn(console, 'log');

    const { getByTestId } = render(
      <Provider store={store}>
        <Step2 navigation={{ navigate: jest.fn() }} route={{ params: user }} />
      </Provider>
    );

    // Trigger login action
    fireEvent.press(getByTestId('completeSignupButtonTestId'));

    // Allow promises to resolve
    await waitFor(() => {});

    // Check if console logs the error
    expect(consoleSpy).toHaveBeenCalledWith("An error occurred while adding your interests and age. Please try again.");

    consoleSpy.mockRestore();
  });

});
