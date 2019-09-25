import {applyMiddleware, createStore, compose} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import {createLogger} from 'redux-logger';

import rootReducer from '../reducers/index';


let middleware = applyMiddleware(thunk);

if (process.env.NODE_ENV === 'development') {
  const logger = createLogger({
    collapsed: true
  });
  middleware = composeWithDevTools(applyMiddleware(thunk, logger));
}

const store = createStore(rootReducer, middleware);


export default store;