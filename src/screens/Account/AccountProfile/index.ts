import { createStackNavigator } from "react-navigation";

import AccountProfileScreen from "./AccountProfileScreen";

const AccountProfileStack = createStackNavigator(
  {
    AccountProfileMain: AccountProfileScreen
  },
  {
    initialRouteName: "AccountProfileMain"
  }
);

export default AccountProfileStack;
