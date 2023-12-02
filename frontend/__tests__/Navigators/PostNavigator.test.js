import React from 'react';
import { render } from '@testing-library/react-native';
import PostNavigator from '../../Navigators/PostNavigator';

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
  jest.mock('../../Screens/Post/Post', () => 'Post');
  
  describe('PostNavigator', () => {
    test('renders the stack navigator with correct screens', () => {
      const { getByTestId } = render(<PostNavigator />);
  
      expect(getByTestId('stackNavigator')).toBeTruthy();
      expect(getByTestId('stackScreen-Post Main')).toBeTruthy();
    });
  
    test('was called with appropriate props', () => {
      // Render component
      render(<PostNavigator />);
      // Access the mocked StackNavigatorMock
      const { StackNavigatorMock } = require('@react-navigation/stack');
  
      // Check if StackNavigatorMock has been called with the correct props
      expect(StackNavigatorMock).toHaveBeenCalledTimes(1);
    });
  });
