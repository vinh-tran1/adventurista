import React from 'react';
import { render } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import MainNavigator from '../../Navigators/MainNavigator';
import { userReducer } from '../../Redux/userSlice';

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

// Mock Redux
jest.mock('../../Redux/userSlice', () => ({
  selectIsLoggedIn: jest.fn(),
}));

// Mock other navigators
jest.mock('../../Navigators/FeedNavigator', () => 'FeedNavigator');
jest.mock('../../Navigators/CalendarNavigator', () => 'CalendarNavigator');
jest.mock('../../Navigators/PostNavigator', () => 'PostNavigator');
jest.mock('../../Navigators/SavedEventsNavigator', () => 'SavedEventsNavigator');
jest.mock('../../Navigators/ProfileNavigator', () => 'ProfileNavigator');

const mockStore = configureStore([]);
const store = mockStore({
  userInfo: userReducer
});

describe('MainNavigator', () => {

  // test('renders the authentication navigator when not logged in', () => {

  //   // Mock isLoggedIn to be false
  //   require('../../Redux/userSlice').selectIsLoggedIn.mockReturnValue(false);

  //   const { getByTestId } = render(
  //     <Provider store={store}>
  //       <MainNavigator />
  //     </Provider>
  //   );

  //   expect(getByTestId('authenticationNavigator')).toBeTruthy();
  // });

  test('renders the tab navigator when logged in', () => {

    require('../../Redux/userSlice').selectIsLoggedIn.mockReturnValue(true);

    const { getByTestId } = render(
      <Provider store={store}>
        <MainNavigator />
      </Provider>
    );

    expect(getByTestId('tabNavigator')).toBeTruthy();
    expect(getByTestId('tabScreen-Feed')).toBeTruthy();
    expect(getByTestId('tabScreen-Calendar')).toBeTruthy();
    expect(getByTestId('tabScreen-Post')).toBeTruthy();
    expect(getByTestId('tabScreen-Saved Events')).toBeTruthy();
    expect(getByTestId('tabScreen-Profile')).toBeTruthy();

  });
});
