import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import Signup from '../../Screens/Authenticate/Signup/Signup';

// Mock Redux store and actions
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

// Mock the Axios library
import axios from 'axios';
jest.mock('axios');

const mockStore = configureStore([]);

describe('Signup Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
  });

  test('renders correctly', () => {
    const { getByText } = render(
      <Provider store={store}>
        <Signup navigation={{ navigate: jest.fn() }} />
      </Provider>
    );

    expect(getByText('Sign Up')).toBeTruthy();
  });

  test('handles signup correctly', async () => {
    // Mock the resolved promise for the axios request
    axios.post.mockResolvedValue({
      status: 201,
      data: {
        userId: 'mockUserId',
        // other user properties...
      },
    });

    const consoleSpy = jest.spyOn(console, 'log');

    const { getByTestId } = render(
      <Provider store={store}>
        <Signup navigation={{ navigate: jest.fn() }} />
      </Provider>
    );

    // Trigger signup action
    fireEvent.press(getByTestId('signup'));

    // Allow promises to resolve
    await waitFor(() => {});

    expect(consoleSpy).toHaveBeenCalledWith('Account successfully created!');
    consoleSpy.mockRestore();
  });

  test('handles signup error correctly', async () => {
    // Mock the rejected promise for the axios request
    axios.post.mockRejectedValue(new Error('Failed to fetch data'));

    const consoleSpy = jest.spyOn(console, 'log');

    const { getByTestId } = render(
      <Provider store={store}>
        <Signup navigation={{ navigate: jest.fn() }} />
      </Provider>
    );

    // Trigger signup action
    fireEvent.press(getByTestId('signup'));

    // Allow promises to resolve
    await waitFor(() => {});

    // Check if console logs the error
    expect(consoleSpy).toHaveBeenCalledWith("An error occurred while creating the account. Please try again.");

    consoleSpy.mockRestore();
  });

  test('navigates to login screen correctly', () => {
    const navigateMock = jest.fn();

    const { getByTestId } = render(
      <Provider store={store}>
        <Signup navigation={{ navigate: navigateMock }} />
      </Provider>
    );

    // Trigger navigation to login screen
    fireEvent.press(getByTestId('login'));

    // Check if navigation was called with the correct argument
    expect(navigateMock).toHaveBeenCalledWith('Login Main');
  });

  test('updates inputs correctly', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <Signup navigation={{ navigate: jest.fn() }} />
      </Provider>
    );

    const firstNameInput = getByTestId('firstname');
    fireEvent.changeText(firstNameInput, 'John');
    expect(firstNameInput.props.value).toBe('John');

    const lastNameInput = getByTestId('lastname');
    fireEvent.changeText(lastNameInput, 'Doe');
    expect(lastNameInput.props.value).toBe('Doe');

    const emailInput = getByTestId('email');
    fireEvent.changeText(emailInput, 'john.doe@example.com');
    expect(emailInput.props.value).toBe('john.doe@example.com');

    const passwordInput = getByTestId('password');
    fireEvent.changeText(passwordInput, 'password123');
    expect(passwordInput.props.value).toBe('password123');

  });

});
