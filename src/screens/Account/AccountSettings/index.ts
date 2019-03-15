import { createStackNavigator } from "react-navigation";

import AccountSettingsScreen from "./AccountSettingsScreen";
import AccountMnemonicScreen from "./AccountMnemonicScreen";

const AccountSettingsStack = createStackNavigator(
  {
    AccountSettingsMain: AccountSettingsScreen,
    AccountSettingsMnemonic: AccountMnemonicScreen
  },
  {
    initialRouteName: "AccountSettingsMain"
  }
);

export default AccountSettingsStack;
