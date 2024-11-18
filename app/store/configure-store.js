import {createStore, applyMiddleware} from 'redux';
import {logger} from 'redux-logger';
import rootReducer from './reducers';
import thunkMiddleware from 'redux-thunk';
const middlewares = [];
middlewares.push(thunkMiddleware);
if (__DEV__) {
  middlewares.push(logger);
}
const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);
export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(rootReducer, initialState);
  return store;
}
