import * as React from "react";
import { View, Image } from "react-native";
import SettingsList from "react-native-settings-list";

class AccountSettingsScreen extends React.Component<any, any> {
  static navigationOptions = {
    title: "Settings",
    headerTitle: "Settings"
  };

  render = () => (
    <View style={{ flex: 1 }}>
      <SettingsList borderColor="lightgray" defaultItemSize={50}>
        <SettingsList.Item
          icon={
            <Image
              style={{
                width: 25,
                height: 25,
                margin: 15,
                marginLeft: 25,
                marginRight: 10
              }}
              source={require("../../../assets/write-down.png")}
            />
          }
          title="Mnemonic"
          titleInfo={"Backup your mnemonic"}
          titleInfoStyle={{ color: "#777" }}
          onPress={() =>
            this.props.navigation.navigate("AccountSettingsMnemonic")
          }
        />
      </SettingsList>
    </View>
  );
}

const reduxProps = (reduxState: any) => ({
  chainId: reduxState.account.chainId,
  address: reduxState.account.address
});

export default AccountSettingsScreen;
