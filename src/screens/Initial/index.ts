import { createStackNavigator } from "react-navigation";

import InitialAppScreen from "./InitialAppScreen";

const InitialStack = createStackNavigator(
  {
    InitialApp: InitialAppScreen
  },
  {
    initialRouteName: "InitialApp",
    headerMode: "none"
  }
);

export default InitialStack;
