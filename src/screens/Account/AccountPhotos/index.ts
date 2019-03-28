import { createStackNavigator } from "react-navigation";

import AccountPhotosScreen from "./AccountPhotosScreen";

const AccountPhotosStack = createStackNavigator(
  {
    AccountPhotosMain: AccountPhotosScreen
  },
  {
    initialRouteName: "AccountPhotosMain"
  }
);

export default AccountPhotosStack;
