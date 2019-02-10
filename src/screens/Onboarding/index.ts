import { createStackNavigator } from "react-navigation";

import InitialAppScreen from "./InitialAppScreen";
import CreateAccountScreen from "./CreateAccountScreen";
import RecoverAccountScreen from "./RecoverAccountScreen";

const OnboardingStack = createStackNavigator(
  {
    InitialApp: InitialAppScreen,
    CreateAccount: CreateAccountScreen,
    RecoverAccount: RecoverAccountScreen
  },
  {
    initialRouteName: "InitialApp",
    headerMode: "none"
  }
);

export default OnboardingStack;
