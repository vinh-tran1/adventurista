import React from 'react';
import { render } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import MainNavigator from '../../Navigators/MainNavigator';
import { NavigationContainer } from '@react-navigation/native';

jest.mock('@react-navigation/bottom-tabs', () => {
  const TabNavigatorMock = jest.fn(({ children }) => (
    <div testID="tabNavigator">{children}</div>
  ));

  const createBottomTabNavigator = jest.fn(() => ({
    Navigator: TabNavigatorMock,
    Screen: jest.fn(({ name, component }) => (
      <div testID={`tabScreen-${name}`}>{component}</div>
    )),
  }));

  return {
    createBottomTabNavigator,
    TabNavigatorMock,
  };
});

// Mock other navigators
jest.mock('../../Navigators/FeedNavigator', () => 'FeedNavigator');
jest.mock('../../Navigators/CalendarNavigator', () => 'CalendarNavigator');
jest.mock('../../Navigators/PostNavigator', () => 'PostNavigator');
jest.mock('../../Navigators/SavedEventsNavigator', () => 'SavedEventsNavigator');
jest.mock('../../Navigators/ProfileNavigator', () => 'ProfileNavigator');

const mockStore = configureStore([]);

describe('MainNavigator', () => {
  let store;

    beforeEach(() => {
      store = mockStore({});
    });

  test('renders the authentication navigator when not logged in', () => {
    const store = mockStore({
      user: {
        isLoggedIn: true,
      },
    });

    const { getByTestId } = render(
      <Provider store={store}>
        <MainNavigator />
      </Provider>
    );

    expect(getByTestId('tabNavigator')).not.toBeTruthy();
    expect(getByTestId('authenticationNavigator')).toBeTruthy();
  });

  test('renders the tab navigator when logged in', () => {
    const store = mockStore({
      user: {
        isLoggedIn: true,
      },
    });

    const { getByTestId } = render(
        <Provider store={store}>
            <MainNavigator />
        </Provider>
    );

    expect(getByTestId('tabNavigator')).toBeTruthy();
    expect(getByTestId('authenticationNavigator')).not.toBeTruthy();
  });
});
