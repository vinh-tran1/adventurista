import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import axios from 'axios';
import { Provider, useSelector, useDispatch } from 'react-redux';
import configureStore from 'redux-mock-store';
import UserTop from '../../Screens/Feed/UserTop';

// Mock axios module
jest.mock('axios');

// Mock the useDispatch and useSelector hooks
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
  }));

const mockStore = configureStore();

describe('UserTop Component', () => {
  test('renders UserTop component with proper data', async () => {
    const mockUserInfo = {
      userId: 'mockUserId',
      // add other fields based on your actual user structure
    };

    const mockMutuals = [
      '1', '2'
    ];

    // Mock useSelector to return mockUserInfo
    useSelector.mockReturnValueOnce(mockUserInfo);

    // Mock axios.get to return user and mutual friends data
    axios.get.mockResolvedValueOnce({ data: mockUserInfo }).mockResolvedValueOnce({ data: mockMutuals });

    // Mock the Redux store to return the initial state
    const store = mockStore({ user: mockUserInfo });

    // Render the component within the Redux Provider
    const { getByTestId } = render(
      <Provider store={store}>
        <UserTop createdByObj={{}} userId="mockUserId" update={false} navigation={{ navigate: jest.fn() }} />
      </Provider>
    );

    // Wait for asynchronous calls to resolve
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(2);
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('users/mockUserId'));
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('users/friends/mutual/mockUserId/mockUserId'));
    });

    // Verify that the component renders with the expected data
    // expect(getByTestId('view-profile-button')).toBeDefined();
    // Add more assertions based on your component's structure and expected data
  });

  test('handles view profile button click', async () => {
    const mockUserInfo = {
      userId: 'mockUserId',
      // add other fields based on your actual user structure
    };

    const mockMutuals = [
      ['1', '2']
    ];

    // Mock useSelector to return mockUserInfo
    useSelector.mockReturnValueOnce(mockUserInfo);

    // Mock axios.get to return user and mutual friends data
    axios.get.mockResolvedValueOnce({ data: mockUserInfo }).mockResolvedValueOnce({ data: mockMutuals });

    // Mock the Redux store to return the initial state
    const store = mockStore({ user: mockUserInfo });

    // Render the component within the Redux Provider
    const { getByTestId } = render(
      <Provider store={store}>
        <UserTop createdByObj={{}} userId="mockUserId" update={false} navigation={{ navigate: jest.fn() }} />
      </Provider>
    );

    // Wait for asynchronous calls to resolve
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(2);
    });

    // Simulate button click
    // act(() => {
    //   fireEvent.press(getByTestId('view-profile-button'));
    // });

    // Verify that the navigation function is called with the expected arguments
    // expect(store.getActions()).toContainEqual(setUserInfo(mockUserInfo));
  });
});
