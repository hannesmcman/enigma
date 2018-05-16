import React from "react";
import { createStackNavigator } from "react-navigation";
import { createStore, combineReducers } from "redux";
import { connect } from "react-redux";
import { Login, ChatClient } from "./views";
import {
  createReduxBoundAddListener,
  createReactNavigationReduxMiddleware
} from "react-navigation-redux-helpers";

export const AppNavigator = createStackNavigator(
  {
    Login: { screen: Login },
    ChatClient: { screen: ChatClient }
  },
  {
    initialRouteName: "Login"
  }
);

const middleware = createReactNavigationReduxMiddleware(
  "root",
  state => state.nav
);

const addListener = createReduxBoundAddListener("root");

const AppWithNavigationState = ({ dispatch, nav }) => (
  <AppNavigator
    navigation={{
      dispatch: dispatch,
      state: nav,
      addListener
    }}
  />
);

const mapStateToProps = state => ({
  nav: state.nav
});

export default connect(mapStateToProps)(AppWithNavigationState);
