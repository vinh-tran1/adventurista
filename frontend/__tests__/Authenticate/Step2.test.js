import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
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
    requests: {
      outgoing: [],
      incoming: []
    }
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
    axios.post.mockResolvedValue({status: 200, data: user});

    const consoleSpy = jest.spyOn(console, 'log');

    const { getByTestId } = render(
      <Provider store={store}>
        <Step2 navigation={{ navigate: jest.fn() }} route={{ params: user }} />
      </Provider>
    );

       // Trigger complete signup action
       fireEvent.press(getByTestId('completeSignupButtonTestId'));

       // Use act to wait for asynchronous operations to complete
       await act(async () => {
         // Ensure that the axios.post promise has resolved
         await new Promise((resolve) => setTimeout(resolve, 0));
       });

        // Check if the Redux action is dispatched
        const actions = store.getActions();
        expect(actions.length).toBe(0);
        //expect(actions[0].type).toBe('SET_USER_INFO');

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

  test('handles adding interests correctly', async () => {
    // Mock the resolved promise for the axios request
    axios.post.mockResolvedValue({ status: 200, data: user });

    const { getByTestId, getByPlaceholderText, queryByText } = render(
      <Provider store={store}>
        <Step2 navigation={{ navigate: jest.fn() }} route={{ params: user }} />
      </Provider>
    );

    // Add interest
    const interestInput = getByTestId('interest');
    const addButton = getByTestId('addInterestButton');
    fireEvent.changeText(interestInput, 'Food');
    fireEvent.press(addButton);

    // Wait for the asynchronous operations to complete
    await waitFor(() => {
      const interestsText = queryByText('Food');
      expect(interestsText).toBeTruthy();
    });
  });

  test('handles removing interests correctly', async () => {
    // Mock the resolved promise for the axios request
    axios.post.mockResolvedValue({ status: 200, data: user });

    const { getByTestId, queryByText } = render(
      <Provider store={store}>
        <Step2 navigation={{ navigate: jest.fn() }} route={{ params: user }} />
      </Provider>
    );

    // Add interest first
    const interestInput1 = getByTestId('interest');
    const addButton1 = getByTestId('addInterestButton');
    fireEvent.changeText(interestInput1, 'Food');
    fireEvent.press(addButton1);

    const interestInput2 = getByTestId('interest');
    const addButton2 = getByTestId('addInterestButton');
    fireEvent.changeText(interestInput2, 'Beach');
    fireEvent.press(addButton2);

    const interestInput3 = getByTestId('interest');
    const addButton3 = getByTestId('addInterestButton');
    fireEvent.changeText(interestInput3, 'Games');
    fireEvent.press(addButton3);

    // Remove interest
    const removeButton = getByTestId('removeInterestButton');
    fireEvent.press(removeButton);

    // Wait for the asynchronous operations to complete
    await waitFor(() => {
      const interestsText = queryByText('Food');
      expect(interestsText).toBeNull();
    });
  });

});
