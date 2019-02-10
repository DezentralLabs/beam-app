import { createStore, applyMiddleware, combineReducers } from "redux";
import ReduxThunk from "redux-thunk";
import { createReactNavigationReduxMiddleware } from "react-navigation-redux-helpers";
import logger from "redux-logger";
import account from "./_account";
import navigation from "./_navigation";

export const reducers = combineReducers({
  account,
  navigation
});

export const middleware = applyMiddleware(
  createReactNavigationReduxMiddleware((state: any) => state.navigation),
  ReduxThunk,
  logger
);

export const store = createStore(reducers, middleware);

export const { dispatch } = store;

export const { getState } = store;
