import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import ReduxThunk from "redux-thunk";
import { createReactNavigationReduxMiddleware } from "react-navigation-redux-helpers";
import { createLogger } from "redux-logger";
import account from "./_account";
import navigation from "./_navigation";

export const reducers = combineReducers({
  account,
  navigation
});

const loggerMiddleware = createLogger();

const reduxMiddleware = createReactNavigationReduxMiddleware(
  (state: any) => state.navigation
);

const configureStore = compose(
  applyMiddleware(ReduxThunk, loggerMiddleware, reduxMiddleware)
)(createStore);

export const store = configureStore(reducers);

export const { dispatch } = store;

export const { getState } = store;
