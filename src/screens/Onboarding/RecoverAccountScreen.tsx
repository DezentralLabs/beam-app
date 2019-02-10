import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { connect } from "react-redux";
import { accountRecovery, accountUpdateSeedPhrase } from "../../redux/_account";
import TextButton from "../../components/TextButton";
import Button from "../../components/Button";
import Input from "../../components/Input";

class RecoverAccountScreen extends React.Component<any, any> {
  static navigationOptions = {
    title: "Recover Account",
    headerTitle: "Recover Account"
  };

  updateSeedPhrase = (input: string) =>
    this.props.accountUpdateSeedPhrase(input);

  onSubmit = () => this.props.accountRecovery();

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.description}>{`Insert your Seed Phrase`}</Text>
        <View style={[styles.content]}>
          <Input
            placeholder={"Seed Phrase"}
            autoCapitalize={"none"}
            width={300}
            value={this.props.recoverSeedPhrase}
            onChange={this.updateSeedPhrase}
          />
        </View>
        <View style={[styles.content]}>
          <Button
            loading={this.props.loading}
            width={200}
            onPress={this.onSubmit}
          >
            {`Recover`}
          </Button>
          <TextButton
            style={styles.buttonMargin}
            width={300}
            onPress={() => this.props.navigation.goBack()}
          >
            {`Go Back`}
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

const reduxProps = (reduxState: any) => ({
  loading: reduxState.account.loading,
  recoverSeedPhrase: reduxState.account.recoverSeedPhrase
});

export default connect(
  reduxProps,
  { accountRecovery, accountUpdateSeedPhrase }
)(RecoverAccountScreen);
