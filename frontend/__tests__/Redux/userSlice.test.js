import { setUserInfo, setNewPost, clearUser, userReducer } from '../../Redux/userSlice';
import { SET_USER_INFO, SET_NEW_POST, CLEAR_USER } from '../../Redux/constants';

describe('userSlice actions', () => {
  test('setUserInfo action', () => {
    const payload = { userId: '123', firstName: 'John' };
    const expectedAction = {
      type: SET_USER_INFO,
      payload,
    };
    expect(setUserInfo(payload)).toEqual(expectedAction);
  });

  test('setNewPost action', () => {
    const payload = true;
    const expectedAction = {
      type: SET_NEW_POST,
      payload,
    };
    expect(setNewPost(payload)).toEqual(expectedAction);
  });

  test('clearUser action', () => {
    const expectedAction = {
      type: CLEAR_USER,
    };
    expect(clearUser()).toEqual(expectedAction);
  });
});

describe('userSlice reducer', () => {
    const initialState = {
        newPost: false,
        userId: '',
        age: '',
        blockedUsers: [],
        email: '',
        eventsGoingTo: [],
        eventsNotGoingTo: [],
        eventsOwned: [],
        eventsSaved: [],
        firstName: '',
        lastName: '',
        friends: [],
        groups: [],
        interests: [],
        messages: [],
        primaryLocation: '',
        profilePictureUrl: '',
        bannerImageUrl: '',
        bio: '',
        requests: []
    };

    test('SET_USER_INFO', () => {
      const action = {
        type: SET_USER_INFO,
        payload: { userId: '123', firstName: 'John' },
      };
      const newState = userReducer(initialState, action);
      expect(newState.userId).toBe('123');
      expect(newState.firstName).toBe('John');
    });
  
    test('SET_NEW_POST', () => {
      const action = {
        type: SET_NEW_POST,
        payload: true,
      };
      const newState = userReducer(initialState, action);
      expect(newState.newPost).toBe(true);
    });
  
    test('CLEAR_USER', () => {
      const action = {
        type: CLEAR_USER,
      };
      const newState = userReducer(
        { ...initialState, userId: '123', newPost: true },
        action
      );
      expect(newState).toEqual(initialState);
    });
  });
