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
    first_name: '',
    last_name: '',
    email: '',
};

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_INFO:
            return {
                ...state,
                id: action.payload._id,
                first_name: action.payload.first_name,
                last_name: action.payload.last_name,
                email: action.payload.email,
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