import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import Login from '../../Screens/Authenticate/Login/Login';

// Mock Redux store and actions
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

// Mock the Axios library
import axios from 'axios';
jest.mock('axios');

const mockStore = configureStore([]);

describe('Login Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
  });

  test('renders correctly', () => {
    const { getByText } = render(
      <Provider store={store}>
        <Login navigation={{ navigate: jest.fn() }} />
      </Provider>
    );

    expect(getByText('Login')).toBeTruthy(); 
  });

  test('handles login correctly', async () => {
    // Mock the resolved promise for the axios request
    axios.post.mockResolvedValue({
      status: 200,
      data: {
        userId: 'mockUserId',
        // other user properties...
      },
    });

    const consoleSpy = jest.spyOn(console, 'log');

    const { getByTestId } = render(
      <Provider store={store}>
        <Login navigation={{ navigate: jest.fn() }} />
      </Provider>
    );

    // Trigger login action
    fireEvent.press(getByTestId('loginButtonTestId')); 

    // Allow promises to resolve
    await waitFor(() => {});

    // Check if the Redux action is dispatched
    const actions = store.getActions();
    expect(actions.length).toBe(1);
    expect(actions[0].type).toBe('SET_USER_INFO'); 


    expect(consoleSpy).toHaveBeenCalledWith('Login successful!');
    consoleSpy.mockRestore();

    });

test('handles login error correctly', async () => {
    // Mock the rejected promise for the axios request
    axios.post.mockRejectedValue(new Error('Failed to fetch data'));

    const consoleSpy = jest.spyOn(console, 'log');

    const { getByTestId } = render(
      <Provider store={store}>
        <Login navigation={{ navigate: jest.fn() }} />
      </Provider>
    );

    // Trigger login action
    fireEvent.press(getByTestId('loginButtonTestId'));

    // Allow promises to resolve
    await waitFor(() => {});

    // Check if console logs the error
    expect(consoleSpy).toHaveBeenCalledWith('An error occurred while logging in with this account. Please try again.');

    consoleSpy.mockRestore();
  });

  
  test('updates email and password correctly', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <Login navigation={{ navigate: jest.fn() }} />
      </Provider>
    );

    const emailInput = getByTestId('email');
    const passwordInput = getByTestId('password');

    // Update email and password inputs
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    // Check if inputs are updated correctly
    expect(emailInput.props.value).toBe('test@example.com');
    expect(passwordInput.props.value).toBe('password123');
  });

  test('navigates to signup screen correctly', () => {
    const navigateMock = jest.fn();

    const { getByTestId } = render(
      <Provider store={store}>
        <Login navigation={{ navigate: navigateMock }} />
      </Provider>
    );

    // Trigger navigation to signup screen
    fireEvent.press(getByTestId('signup'));

    // Check if navigation was called with the correct argument
    expect(navigateMock).toHaveBeenCalledWith('Signup Main');
  });
  
});
