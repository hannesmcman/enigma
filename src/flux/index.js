import { createStore, applyMiddleware, combineReducers } from "redux";
import { createLogger } from "redux-logger";
import reduxPromise from "redux-promise";
import reduxThunk from "redux-thunk";

import { NavReducer } from "./reducers/NavReducer";
import { app } from "./reducers/app";

// export {init as initRedux} from './init'

export const makeStore = () => {
  const AppReducer = combineReducers({
    nav: NavReducer,
    app
  });

  const middleware = [reduxPromise, reduxThunk];

  if (__DEV__) {
    const logger = createLogger({
      collapsed: true,
      duration: true
    });
    middleware.push(logger);
  }

  return createStore(AppReducer, applyMiddleware(...middleware));
};
