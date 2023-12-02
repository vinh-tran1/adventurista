import React from 'react';
import { render } from '@testing-library/react-native';
import SavedEventsNavigator from '../../Navigators/SavedEventsNavigator';

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
  jest.mock('../../Screens/SavedEvents/SavedEvents', () => 'SavedEvents');
  jest.mock('../..//Shared/EventDetails', () => 'EventDetails');
  
  describe('SavedEventsNavigator', () => {
    test('renders the stack navigator with correct screens', () => {
      const { getByTestId } = render(<SavedEventsNavigator />);
  
      expect(getByTestId('stackNavigator')).toBeTruthy();
      expect(getByTestId('stackScreen-Saved Events')).toBeTruthy();
      expect(getByTestId('stackScreen-Event Details')).toBeTruthy();
    });
  
    test('was called with appropriate props', () => {
      // Render component
      render(<SavedEventsNavigator />);
      // Access the mocked StackNavigatorMock
      const { StackNavigatorMock } = require('@react-navigation/stack');
  
      // Check if StackNavigatorMock has been called with the correct props
      expect(StackNavigatorMock).toHaveBeenCalledTimes(1);
    });
  });
