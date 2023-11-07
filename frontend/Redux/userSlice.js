import { SET_USER_INFO, CLEAR_USER, SET_NEW_POST } from './constants';

// ACTIONS
export const setUserInfo = (payload) => {
    return {
        type: SET_USER_INFO,
        payload
    }
}

export const setNewPost = (payload) => {
    return {
        type: SET_NEW_POST,
        payload
    }
}

export const clearUser = () => {
    return {
        type: CLEAR_USER
    }
}


// REDUCER
const initialState = {
    newPost: false,
    userId: '',
    age: '',
    blockedUsers: [],
    email: '',
    eventsGoingTo: [],
    eventsNotGoingTo: [],
    eventsOwend: [],
    firstName: '',
    lastName: '',
    friends: [],
    groups: [],
    interests: [],
    messages: [],
    primaryLocation: '',
    profilePictureUrl: '',
    requests: []
};

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_INFO:
            return {
                ...state,
                userId: action.payload.userId,
                age: action.payload.age,
                blockedUsers: action.payload.blockedUsers,
                email: action.payload.email,
                eventsGoingTo: action.payload.eventsGoingTo,
                eventsNotGoingTo: action.payload.eventsNotGoingTo,
                eventsOwend: action.payload.eventsOwend,
                firstName: action.payload.firstName,
                lastName: action.payload.lastName,
                friends: action.payload.friends,
                groups: action.payload.groups,
                interests: action.payload.interests,
                messages: action.payload.messages,
                primaryLocation: action.payload.primaryLocation,
                profilePictureUrl: action.payload.profilePictureUrl,
                requests: action.payload.requests

            }
        case CLEAR_USER:
            return state = initialState;
        case SET_NEW_POST:
            return {
                ...state,
                newPost: action.payload
            }
    }
    return state;
}


// SELECTOR
export const selectIsLoggedIn = (state) => state.userInfo.userId.length > 0;
export const selectUserInfo = (state) => state.userInfo;
export const selectNewPost = (state) => state.newPost;