import * as React from "react";
import { Image } from "react-native";
import { createBottomTabNavigator } from "react-navigation";

import AccountProfileStack from "./AccountProfile";
import AccountSettingsStack from "./AccountSettings";

const AccountStack = createBottomTabNavigator(
  {
    Profile: AccountProfileStack,
    Settings: AccountSettingsStack
  },
  {
    initialRouteName: "Profile",
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;

        let iconSource = null;

        switch (routeName) {
          case "Profile":
            iconSource = focused
              ? require("../../assets/picture-blue.png")
              : require("../../assets/picture-gray.png");
            break;
          case "Settings":
            iconSource = focused
              ? require("../../assets/settings-blue.png")
              : require("../../assets/settings-gray.png");
            break;
          default:
            break;
        }

        return (
          <Image
            source={iconSource}
            style={{ width: 25, height: 25, margin: 10 }}
          />
        );
      }
    }),
    tabBarOptions: {
      activeTintColor: "#3b99fc",
      inactiveTintColor: "gray"
    }
  }
);

export default AccountStack;
