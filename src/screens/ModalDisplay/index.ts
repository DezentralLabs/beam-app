import { createStackNavigator } from "react-navigation";

import ModalDisplay from "./ModalDisplay";

const ModalDisplayStack = createStackNavigator(
  {
    Display: ModalDisplay
  },
  {
    initialRouteName: "Display",
    mode: "modal"
  }
);

export default ModalDisplayStack;
