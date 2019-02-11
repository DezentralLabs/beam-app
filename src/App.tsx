import * as React from "react";
import { connect } from "react-redux";
import { createStackNavigator, createAppContainer } from "react-navigation";
import { accountInit } from "./redux/_account";
import { setTopLevelNavigator } from "./navigation";
import OnboardingStack from "./screens/Onboarding";
import AccountStack from "./screens/Account";
import ModalStack from "./screens/Modal";
import { deleteMnemonic } from "./helpers/wallet";
import { deleteProfile } from "./helpers/asyncStorage";

const MainStack = createStackNavigator(
  {
    Onboarding: OnboardingStack,
    Account: AccountStack
  },
  {
    initialRouteName: "Account",
    headerMode: "none",
    mode: "modal"
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
  componentDidMount() {
    // this.resetApp();
    this.props.accountInit();
  }
  resetApp = async () => {
    await deleteMnemonic();
    await deleteProfile();
  };
  render = () => (
    <AppContainer ref={navigatorRef => setTopLevelNavigator(navigatorRef)} />
  );
}

export default connect(
  null,
  { accountInit }
)(App);
