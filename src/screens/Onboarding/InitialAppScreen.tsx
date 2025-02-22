import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "../../components/Button";
import TextButton from "../../components/TextButton";

class InitialAppScreen extends React.Component<any, any> {
  static navigationOptions = {
    title: "Initial",
    headerTitle: "Initial"
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.description}>
          {`Be in control of your social media`}
        </Text>
        <View style={[styles.content]}>
          <Button
            width={200}
            onPress={() => this.props.navigation.navigate("CreateAccount")}
          >
            {`Create new account`}
          </Button>
          <TextButton
            style={styles.buttonMargin}
            width={300}
            onPress={() => this.props.navigation.navigate("RecoverAccount")}
          >
            {`I already have an account`}
          </TextButton>
        </View>
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
  content: {
    marginTop: 20
  },
  description: {
    textAlign: "center",
    fontSize: 24,
    marginTop: 20,
    marginBottom: 20
  },
  buttonMargin: {
    marginTop: 8
  }
});

export default InitialAppScreen;
