import { createStackNavigator } from "react-navigation";

import ModalImport from "./ModalImport";
import ModalDisplay from "./ModalDisplay";

const ModalStack = createStackNavigator(
  {
    Import: ModalImport,
    Display: ModalDisplay
  },
  {
    initialRouteName: "Import",
    mode: "modal"
  }
);

export default ModalStack;
