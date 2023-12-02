import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { userReducer } from './userSlice';

const reducers = combineReducers({
    userInfo: userReducer,
})

const store = createStore(reducers, applyMiddleware(thunk));

export default store;