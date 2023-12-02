import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import ProfileUser from '../../Screens/Profile/ProfileUser';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { useSelector } from 'react-redux';

jest.mock('@fortawesome/react-native-fontawesome', () => ({
  FontAwesomeIcon: 'mock-FontAwesomeIcon',
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

describe('ProfileUser Component', () => {
  const mockStore = configureStore([]);
  let store;

  beforeEach(() => {
    store = mockStore({
      user: {
        firstName: 'John',
        lastName: 'Doe',
        age: '2002-11-03',
        primaryLocation: 'New York',
        bio: 'This is a bio',
        interests: ['Interest1', 'Interest2'],
        eventsOwned: ['1', '2', '3'],
        friends: ['1'],
      },
    });
  });

  test('renders correctly', async () => {
    useSelector.mockReturnValue({
      user: {
        firstName: 'John',
        lastName: 'Doe',
        age: '2002-11-03',
        primaryLocation: 'New York',
        bio: 'This is a bio',
        interests: ['Interest1', 'Interest2'],
        eventsOwned: ['1', '2', '3'],
        friends: ['1'],
      },
    });

    const { getByText } = render(
      <Provider store={store}>
        <ProfileUser navigation={{}} />
      </Provider>
    );

    // Wait for the component to render
    await waitFor(() => {
      // Check if the component renders the expected profile information
      expect(getByText(/Log Out/i)).toBeDefined();
      expect(getByText(/Groups/i)).toBeDefined();
      expect(getByText(/My Events/i)).toBeDefined(); // Replace with the correct count
      expect(getByText(/Connections/i)).toBeDefined(); // Replace with the correct count
    });
  });

  // Add more tests for other functionality as needed
});
