import * as React from "react";
import { connect } from "react-redux";
import { createStackNavigator, createAppContainer } from "react-navigation";

import { setTopLevelNavigator } from "./navigation";
import OnboardingStack from "./screens/Onboarding";
import AccountStack from "./screens/Account";
import ModalStack from "./screens/Modal";

const MainStack = createStackNavigator(
  {
    Onboarding: OnboardingStack,
    Account: AccountStack
  },
  {
    initialRouteName: "Onboarding",
    headerMode: "none"
  }
);

const AppNavigator = createStackNavigator(
  {
    Main: MainStack,
    Modal: ModalStack
  },
  {
    initialRouteName: "Main",
    headerMode: "none",
    mode: "modal"
  }
);

const AppContainer = createAppContainer(AppNavigator);

class App extends React.Component<any, any> {
  componentDidMount() {}
  render = () => (
    <AppContainer ref={navigatorRef => setTopLevelNavigator(navigatorRef)} />
  );
}

export default connect(
  null,
  null
)(App);
