import { createStackNavigator } from "react-navigation";

import ModalImport from "./ModalImport";

const ModalStack = createStackNavigator(
  {
    Import: ModalImport
  },
  {
    mode: "modal"
  }
);

export default ModalStack;
