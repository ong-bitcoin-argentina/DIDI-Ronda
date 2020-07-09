import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import rootReducer from "../reducers/index";

let middleware = applyMiddleware(thunk);

if (process.env.NODE_ENV === "development") {
  middleware = composeWithDevTools(applyMiddleware(thunk));
}

const store = createStore(rootReducer, middleware);

export default store;
