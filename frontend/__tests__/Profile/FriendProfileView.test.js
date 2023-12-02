import { render, waitFor, fireEvent, findByProps } from '@testing-library/react-native';
import FriendProfileView from '../../Screens/Profile/FriendProfileView';
import { useSelector } from 'react-redux';

// Mock Redux store and actions
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

// Mock the Axios library
import axios from 'axios';
jest.mock('axios');

const mockStore = configureStore([]);

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
  let store;

  beforeEach(() => {
    store = mockStore({});
  });

  test('renders correctly when user is not a friend', async () => {

    useSelector.mockReturnValue({
      user: {
          friends: ['Vinh123'],
          requests: {
              outgoing: ['123'],
              incoming: ['456']
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
                route={{ params: { poster: { userId:'Vinh1234', firstName: 'Vinh' } } }}
            />
        </Provider>
      
    );

    // Wait for the component to render
    await waitFor(() => {
      // Check if the component renders the expected text
      expect(getByText(/not a friend/i)).toBeDefined();
    });

    // You can add more specific assertions or checks here based on your requirements
  });

  test('renders correctly when user is a friend', async () => {
    const { getByText } = render(
      <Provider store={store}>
          <FriendProfileView
              navigation={{ goBack: jest.fn() }}
              route={{ params: { poster: { userId:'Vinh123', firstName: 'Vinh' } } }}
          />
      </Provider>
    
  );

    // Wait for the component to render
    await waitFor(() => {
      // Check if the component renders the expected text
      expect(getByText(/Groups/i)).toBeDefined();
    });

    // You can add more specific assertions or checks here based on your requirements
  });

  test('handles add friend button click correctly', async () => {
    const { getByText } = render(
      <Provider store={store}>
          <FriendProfileView
              navigation={{ goBack: jest.fn() }}
              route={{ params: { poster: { userId:'Vinh123', firstName: 'Vinh' } } }}
          />
      </Provider>
    
    );

    // Wait for the component to render
    await waitFor(() => {
      // Find and click the "Add Friend" button
      fireEvent.press(getByText(/Add Friend/i));
    });
    
  });

  test('handles add friend correctly', async () => {
    axios.post.mockResolvedValue({
      status: 200,
      data: {
        // Mock the updated user data
        requesterId: 'mockUserId',
        requestId: 'mockPosterId',
        // ... other properties
      },
    });

    const { getByText } = render(
      <Provider store={store}>
        <FriendProfileView
          navigation={{ goBack: jest.fn(), navigate: jest.fn() }}
          route={{ params: { poster: { userId: 'mockUserId' } } }}
        />
      </Provider>
    );

      // Assuming there's a button triggering the add friend function
      fireEvent.press(getByText(/Add Friend/i));

      // Wait for asynchronous operations to complete
      await waitFor(() => {});
  
      expect(getByText(/Requested/i)).toBeDefined();
    });

    test('handles remove friend correctly', async () => {
      axios.post.mockResolvedValue({
        status: 200,
        data: {
          // Mock the updated user data
          requesterId: 'mockUserId',
          requestId: 'mockPosterId',
          // ... other properties
        },
      });
  
      const { getByText, getByTestId } = render(
        // Render your component with necessary props
        <Provider store={store}>
          <FriendProfileView
            navigation={{ goBack: jest.fn(), navigate: jest.fn() }}
            route={{ params: { poster: { userId: 'mockUserId' } } }}
          />
        </Provider>
      );
  
      // Trigger modal opening
      fireEvent.press(getByTestId("ellipsis"));

      // Wait for modal to be visible
      await waitFor(() => {
        expect(getByText(/Not Friends Yet/i)).toBeDefined();
      });

      // Assuming there's a button triggering the remove friend function in the modal
      fireEvent.press(getByText(/Not Friends Yet/i));

      // You might need to wait for the modal to close or any other asynchronous operation to complete
      // Ensure you are awaiting the necessary operations
      await waitFor(() => {});

      expect(getByText(/Add Friend/i)).toBeDefined();
    });

    test('renders profile information correctly', async () => {
      // Mock necessary Redux state
      useSelector.mockReturnValue({
        user: {
          friends: ['Vinh'],
          requests: {
            outgoing: ['123'],
            incoming: ['456']
          },
        },
      });
  
      // Mock Axios response for user data
      axios.get.mockResolvedValue({
        status: 200,
        data: {
          userId: 'mockUserId',
          firstName: 'John',
          lastName: 'Doe',
          age: 25,
          primaryLocation: 'New York',
          bio: 'This is a bio',
          // ... other properties
        },
      });

      const poster = {
        userId: 'mockUserId',
        firstName: 'John',
        lastName: 'Doe',
        age: '2002-11-03',
        primaryLocation: 'New York',
        bio: 'This is a bio',
        eventsGoingTo: ['3', '4', '5'],
        eventsOwned: ['1', '2', '3'],
        friends: ['1'], 
      }
  
      const { getByText, getByTestId } = render(
        <Provider store={store}>
          <FriendProfileView
            navigation={{ goBack: jest.fn() }}
            route={{ params: { poster: poster } }}
          />
        </Provider>
      );
  
      // Wait for the component to render
      await waitFor(() => {
        // Check if the component renders the expected profile information
        expect(getByText(/John Doe/i)).toBeDefined();
        expect(getByText(/21/i)).toBeDefined();
        expect(getByText(/New York/i)).toBeDefined();
        expect(getByText(/This is a bio/i)).toBeDefined();
        expect(getByText(/John Doe/i)).toBeDefined();
        expect(getByText('3')).toBeDefined();
        expect(getByText('1')).toBeDefined();
        expect(getByText('2')).toBeDefined();
        expect(getByText('Events')).toBeDefined();
        expect(getByText('Connections')).toBeDefined();
        expect(getByText('Groups')).toBeDefined();
      });
    });

});
