import * as React from "react";
import {
  Clipboard,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Text,
  View
} from "react-native";
import { getMnemonic } from "../../../helpers/wallet";
import Button from "../../../components/Button";

class AccountMnemonicScreen extends React.Component<any, any> {
  static navigationOptions = {
    title: "Mnemonic",
    headerTitle: "Mnemonic"
  };

  public state = {
    show: false,
    mnemonic: ""
  };

  displayMnemonic = () => {
    const mnemonic = getMnemonic();
    this.setState({ show: true, mnemonic });
  };

  copyToClipboard = () => {
    Clipboard.setString(this.state.mnemonic);
    Alert.alert("Copied", "Mnemonic copied to clipboard");
  };

  render() {
    const { show, mnemonic } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          {!show ? (
            <React.Fragment>
              <Text
                style={styles.description}
              >{`You're about to view your private Mnemonic that is used to recover your account.`}</Text>
              <Text
                style={styles.warning}
              >{`Make sure you don't show this to anyone else.`}</Text>
              <Button width={200} onPress={this.displayMnemonic}>
                Show
              </Button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <TouchableOpacity onPress={this.copyToClipboard}>
                <Text style={styles.mnemonic}>
                  {mnemonic || "Cannot access mnemonic"}
                </Text>
                <Text style={styles.helper}>{"Click to copy"}</Text>
              </TouchableOpacity>
            </React.Fragment>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  description: {
    textAlign: "center",
    padding: 15,
    fontSize: 18
  },
  warning: {
    textAlign: "center",
    fontWeight: "bold",
    padding: 15,
    marginBottom: 20,
    fontSize: 18
  },
  mnemonic: {
    fontFamily: "Menlo-Regular",
    fontSize: 18
  },
  helper: {
    textAlign: "center",
    marginTop: 15,
    fontSize: 16,
    color: "#ccc"
  }
});

export default AccountMnemonicScreen;
