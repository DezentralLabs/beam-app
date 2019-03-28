import * as React from "react";
import { Image } from "react-native";
import { createBottomTabNavigator } from "react-navigation";

import AccountPhotosStack from "./AccountPhotos";
import AccountSettingsStack from "./AccountSettings";

const AccountStack = createBottomTabNavigator(
  {
    Photos: AccountPhotosStack,
    Settings: AccountSettingsStack
  },
  {
    initialRouteName: "Photos",
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;

        let iconSource = null;

        switch (routeName) {
          case "Photos":
            iconSource = focused
              ? require("../../assets/photo-blue.png")
              : require("../../assets/photo-gray.png");
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
