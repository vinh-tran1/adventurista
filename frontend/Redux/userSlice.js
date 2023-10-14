import { SET_USER_INFO, CLEAR_USER } from './constants';

// ACTIONS
export const setUserInfo = (payload) => {
    return {
        type: SET_USER_INFO,
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
    id: '',
    name: '',
    email: '',
    username: '',
    phone_number: '',
};

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_INFO:
            return {
                ...state,
                id: action.payload._id,
                name: action.payload.name,
                email: action.payload.email,
                username: action.payload.username,
                phone_number: action.payload.phone_number,
            }
        case CLEAR_USER:
            return state = initialState;
    }
    return state;
}


// SELECTOR
export const selectIsLoggedIn = (state) => state.userInfo.email.length > 0;
export const selectUserInfo = (state) => state.userInfo;
export const selectUserId = (state) => state.userInfo.id;