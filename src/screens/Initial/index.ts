import { createStackNavigator } from "react-navigation";

import InitialAppScreen from "./InitialAppScreen";

const InitialStack = createStackNavigator({
  InitialApp: InitialAppScreen
});

export default InitialStack;
