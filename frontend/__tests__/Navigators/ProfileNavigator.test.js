import React from 'react';
import { render } from '@testing-library/react-native';
import ProfileNavigator from '../../Navigators/ProfileNavigator';

// Mocking dependencies
jest.mock('@react-navigation/stack', () => {
    const StackNavigatorMock = jest.fn(({ children }) => (
      <div testID="stackNavigator">{children}</div>
    ));
  
    const createStackNavigator = jest.fn(() => ({
      Navigator: StackNavigatorMock,
      Screen: jest.fn(({ name, component }) => (
        <div testID={`stackScreen-${name}`}>{component}</div>
      )),
    }));
  
    return {
      createStackNavigator,
      StackNavigatorMock,
    };
  });

  // Mocking react-native-modal library
  jest.mock('react-native-modal', () => 'MockModal');
  
  // Mock your screens
  jest.mock('../../Screens/Profile/ProfileUser', () => 'Profile');
  jest.mock('../../Screens/Profile/EditProfile', () => 'EditProfile');
  jest.mock('../../Shared//EventDetails', () => 'EventDetails');
  
  describe('ProfileNavigator', () => {
    test('renders the stack navigator with correct screens', () => {
      const { getByTestId } = render(<ProfileNavigator />);
  
      expect(getByTestId('stackNavigator')).toBeTruthy();
      expect(getByTestId('stackScreen-Profile Main')).toBeTruthy();
      expect(getByTestId('stackScreen-Edit Profile')).toBeTruthy();
      expect(getByTestId('stackScreen-Event Details')).toBeTruthy();
    });
  
    test('was called with appropriate props', () => {
      // Render component
      render(<ProfileNavigator />);
      // Access the mocked StackNavigatorMock
      const { StackNavigatorMock } = require('@react-navigation/stack');
  
      // Check if StackNavigatorMock has been called with the correct props
      expect(StackNavigatorMock).toHaveBeenCalledTimes(1);
    });
  });
