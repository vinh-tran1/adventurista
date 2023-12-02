import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Notifications from '../../Screens/Feed/Notifications/Notifications';

// Mock Redux useSelector
import { useSelector } from 'react-redux';
jest.mock('react-redux');

describe('Notifications Component', () => {
  test('renders follow requests with correct count', () => {
    // Mock user data with follow requests
    const mockUser = {
      requests: {
        incoming: ['user1'], // Add as many incoming requests as needed
      },
    };
    useSelector.mockReturnValue(mockUser);

    // Mock navigation prop
    const mockNavigation = {
      goBack: jest.fn(),
    };

    const { getByText, getByTestId } = render(
      <Notifications navigation={mockNavigation} />
    );

    // Check if the title includes the correct count
    expect(getByText('Follow Requests (1)')).toBeTruthy();

    // Check if the follow requests are rendered
    expect(getByTestId('acceptFriendButton')).toBeTruthy();
    expect(getByTestId('denyFriendButton')).toBeTruthy();
  });

  test('calls goBack when back button is pressed', () => {
    // Mock user data with follow requests
    const mockUser = {
      requests: {
        incoming: ['user1', 'user2', 'user3'],
      },
    };
    useSelector.mockReturnValue(mockUser);

    // Mock navigation prop
    const mockNavigation = {
      goBack: jest.fn(),
    };

    const { getByTestId } = render(
      <Notifications navigation={mockNavigation} />
    );

    // Trigger press event on the back button
    fireEvent.press(getByTestId('back-button'));

    // Check if goBack function is called
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });
});
