import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { connect } from "react-redux";
import { accountCreateNew, accountUpdateUsername } from "../../redux/_account";
import TextButton from "../../components/TextButton";
import Button from "../../components/Button";
import Input from "../../components/Input";

class CreateAccountScreen extends React.Component<any, any> {
  static navigationOptions = {
    title: "Create Account",
    headerTitle: "Create Account"
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.description}>{`Choose a new username`}</Text>
        <View style={[styles.content]}>
          <Input
            autoCapitalize={"none"}
            width={300}
            value={this.props.username}
            onChange={this.props.accountUpdateUsername}
          />
        </View>
        <View style={[styles.content]}>
          <Button
            loading={this.props.loading}
            width={200}
            onPress={this.props.accountCreateNew}
          >
            {`Create`}
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
  username: reduxState.account.username
});

export default connect(
  reduxProps,
  { accountCreateNew, accountUpdateUsername }
)(CreateAccountScreen);
