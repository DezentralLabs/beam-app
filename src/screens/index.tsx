import { createStackNavigator } from "react-navigation";

import OnboardingStack from "./Onboarding";
import AccountStack from "./Account";
import ModalStack from "./Modal";

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

export default AppNavigator;
