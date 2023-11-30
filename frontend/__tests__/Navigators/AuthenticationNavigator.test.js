import React from 'react';
import { render } from '@testing-library/react-native';
import AuthenticationNavigator from '../../Navigators/AuthenticationNavigator';

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
  
  // Mock your screens
  jest.mock('../../Screens/Authenticate/Login/Login', () => 'Login');
  jest.mock('../../Screens/Authenticate/Signup/Signup', () => 'Signup');
  jest.mock('../../Screens/Authenticate/Signup/Step2', () => 'Step2');
  
  describe('AuthenticationNavigator', () => {
    test('renders the stack navigator with correct screens', () => {
      const { getByTestId } = render(<AuthenticationNavigator />);
  
      expect(getByTestId('stackNavigator')).toBeTruthy();
      expect(getByTestId('stackScreen-Login Main')).toBeTruthy();
      expect(getByTestId('stackScreen-Signup Main')).toBeTruthy();
      expect(getByTestId('stackScreen-Step 2')).toBeTruthy();
    });
  
    test('was called with appropriate props', () => {
      // Render component
      render(<AuthenticationNavigator />);
      // Access the mocked StackNavigatorMock
      const { StackNavigatorMock } = require('@react-navigation/stack');
  
      // Check if StackNavigatorMock has been called with the correct props
      expect(StackNavigatorMock).toHaveBeenCalledTimes(1);
    });
  });
