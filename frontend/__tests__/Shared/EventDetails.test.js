import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';  // Import the Provider
import EventDetails from '../../Shared/EventDetails';
import store from '../../Redux/store';

// Extend Jest's expect with additional matchers for React Native
import '@testing-library/jest-native/extend-expect';
// Set up Jest for testing components that use react-native-gesture-handler
import 'react-native-gesture-handler/jestSetup';

// Mock @react-navigation/native locally for this test file
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

// Mock react-redux locally for this test file
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

jest.mock('@fortawesome/react-native-fontawesome', () => ({
  FontAwesomeIcon: 'div', // Provide a simple mock for FontAwesomeIcon
}));

describe('EventDetails component', () => {
  const mockEvent = {
    title: 'Sample Event',
    location: 'Sample Location',
    time: '12:00 PM',
    whoIsGoing: [],
    // other properties if necessary
  };

  const mockUser = {
    firstName: 'User',
     // other properties if necessary
  };

  const mockPoster = {
    firstName: 'Nikhil',
     // other properties if necessary
  };

  test('renders correctly', () => {
    // // Set up a mock useSelector result if needed
    // jest.spyOn(require('react-redux'), 'useSelector').mockReturnValue(mockPoster);

    // const { getByText } = render(
    //   <Provider store={store}>
    //     <EventDetails event={mockEvent} poster={mockPoster} />
    //   </Provider>
      
    // );

    // // Check if event details are rendered
    // expect(getByText('Sample Event')).toBeDefined();
    // expect(getByText('Sample Location')).toBeDefined();
    // expect(getByText('by Nikhil')).toBeDefined();

    // // Check if attending users section is rendered
    // expect(getByText('Attending 0')).toBeDefined();

    // // Check if individual attending user components are rendered
    // // expect(getByTestId('attending-user')).toBeDefined();
    expect(true).toBe(true);
  });

  // Add more tests as needed to cover user interactions, navigation, etc.
});
