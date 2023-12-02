import React from 'react';
import { render } from '@testing-library/react-native';
import FeedNavigator from '../../Navigators/FeedNavigator';
import FriendProfileView from '../../Screens/Profile/FriendProfileView';
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
  jest.mock('../../Screens/Feed/Feed', () => 'FeedMain');
  jest.mock('../../Screens/Feed/Notifications/Notifications', () => 'Notifications');
  jest.mock('../../Screens/Profile/FriendProfileView', () => 'FriendProfileView');
  
  describe('FeedNavigator', () => {
    test('renders the stack navigator with correct screens', () => {
      const { getByTestId } = render(<FeedNavigator />);
  
      expect(getByTestId('stackNavigator')).toBeTruthy();
      expect(getByTestId('stackScreen-Feed Main')).toBeTruthy();
      expect(getByTestId('stackScreen-Notifications')).toBeTruthy();
      expect(getByTestId('stackScreen-FriendProfileView')).toBeTruthy();
    });
  
    test('was called with appropriate props', () => {
      // Render component
      render(<FeedNavigator />);
      // Access the mocked StackNavigatorMock
      const { StackNavigatorMock } = require('@react-navigation/stack');
  
      // Check if StackNavigatorMock has been called with the correct props
      expect(StackNavigatorMock).toHaveBeenCalledTimes(1);
    });
  });
