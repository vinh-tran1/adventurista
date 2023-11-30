import axios from 'axios';
import store from '../../Redux/store';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import FriendProfileView from '../../Screens/Profile/FriendProfileView';
import { Provider } from 'react-redux';
import { useSelector } from 'react-redux';

jest.mock('@fortawesome/react-native-fontawesome', () => ({
  FontAwesomeIcon: 'mock-FontAwesomeIcon',
}));

// Mocking react-native-modal library
jest.mock('react-native-modal', () => 'MockModal');

// Mock react-redux locally for this test file
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
  }));

describe('FriendProfileView Component', () => {
  test('renders correctly when user is not a friend', async () => {

    useSelector.mockReturnValue({
        user: {
            friends: [],
            requests: {
                outgoing: [],
            },
        },
      });
  
      // Mock Axios response
      axios.get.mockResolvedValue({
        status: 200,
        data: {
          userId: '123',
          friends: ['friend1', 'friend2'],
          requests: {
            outgoing: ['request1', 'request2'],
          },
          // Other user properties...
        },
    });

    const { getByText } = render(
        <Provider store={store}>
            <FriendProfileView
                navigation={{ goBack: jest.fn() }}
                route={{ params: { poster: { firstName: 'Vinh' } } }}
            />
        </Provider>
      
    );

    // Wait for the component to render
    await waitFor(() => {
      // Check if the component renders the expected text
      expect(getByText(/Add Friend/i)).toBeDefined();
    });

    // You can add more specific assertions or checks here based on your requirements
  });

  test('renders correctly when user is a friend', async () => {
    const { getByText } = render(
        <Provider store={store}>
            <FriendProfileView
                navigation={{ goBack: jest.fn() }}
                route={{ params: { poster: { firstName: 'Vinh', friends: [1] } } }}
            />
        </Provider>
      
    );

    // Wait for the component to render
    await waitFor(() => {
      // Check if the component renders the expected text
      expect(getByText(/My Groups/i)).toBeDefined();
    });

    // You can add more specific assertions or checks here based on your requirements
  });

  test('handles add friend button click correctly', async () => {
    const { getByText } = render(
        <Provider store={store}>
            <FriendProfileView
                navigation={{ goBack: jest.fn() }}
                route={{ params: { poster: { firstName: 'Vinh' } } }}
            />
        </Provider>
    );

    // Wait for the component to render
    await waitFor(() => {
      // Find and click the "Add Friend" button
      fireEvent.press(getByText(/Add Friend/i));
    });

    // You can add more specific assertions or checks here based on your requirements
  });

  // Add more tests for different scenarios and functionalities
});
