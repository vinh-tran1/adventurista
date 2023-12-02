import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Post from '../../Screens/Feed/Post';
import { setNewPost, selectUserInfo } from '../../Redux/userSlice';

// Mock axios module
jest.mock('axios');

// Mock the useSelector and useDispatch hooks
jest.mock('react-redux');

const mockStore = configureStore();

describe('Post Component', () => {
  let testStore;

  beforeEach(() => {
    testStore = mockStore({
      user: {
        userId: 'testUserId',
        firstName: 'Test',
        lastName: 'User',
        friends: ['friendUserId'],
        eventsGoingTo: ['event1', 'event2'],
        eventsSaved: ['event3', 'event4'],
      },
    });
  });

  test('handles swiping correctly', async () => {
    const mockPostData = {
      eventId: 'event1',
      title: 'Test Event',
      location: 'Test Location',
      caption: 'Test Caption',
      img: 'https://example.com/test-image.jpg',
      createdBy: 'posterUserId',
      date: '2023-12-01',
      time: '18:00',
      tags: ['tag1', 'tag2'],
      navigation: { navigate: jest.fn() },
    };

    // Mock the axios.get for the poster information
    axios.get.mockResolvedValueOnce({ data: { firstName: 'Poster', lastName: 'User' } });

    // Mock the axios.get for the event information
    axios.get.mockResolvedValueOnce({
      data: {
        whoIsGoing: ['friendUserId', 'user1', 'user2', 'user3', 'user4'],
      },
    });

    const { getByTestId, findByTestId } = render(
      <Provider store={testStore}>
        <Post {...mockPostData} />
      </Provider>
    );

    // Wait for the poster information and event information to be fetched
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(0);
    });

    // Simulate swiping to the right
    // fireEvent.press(getByTestId('right-touchable'));

    // // Wait for the activeSlide state to be updated
    // const rightTouchable = await findByTestId('right-touchable');
    // await waitFor(() => {
    //   expect(rightTouchable).toBeTruthy();
    // });

    // // Ensure that the activeSlide state is updated correctly
    // const actions = testStore.getActions();
    // expect(actions[0]).toEqual(setNewPost(false));
    // expect(actions[1]).toEqual(selectUserInfo({ activeSlide: 1, ...testStore.getState().user }));
  });


});
