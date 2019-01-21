import * as React from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import Button from "./components/Button";

export default class App extends React.Component<{}> {
  onPress = () => {
    Alert.alert("Upload");
  };
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.description}>Upload your Instagram import</Text>
        <Button width={200} onPress={this.onPress}>
          Upload
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  description: {
    fontSize: 18
  }
});
