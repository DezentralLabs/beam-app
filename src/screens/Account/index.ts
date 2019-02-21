import { createStackNavigator } from "react-navigation";

import AccountProfileScreen from "./AccountProfileScreen";

const AccountStack = createStackNavigator(
  {
    AccountProfile: AccountProfileScreen
  },
  {
    headerMode: "none"
  }
);

export default AccountStack;
