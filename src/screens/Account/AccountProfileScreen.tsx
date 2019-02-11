import * as React from "react";
import {
  FlatList,
  StyleSheet,
  View,
  Image,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import { accountImport } from "../../redux/_account";
import AccountHeader from "../../components/AccountHeader";
import Button from "../../components/Button";
import { WINDOW_WIDTH } from "../../helpers/constants";

class AccountProfileScreen extends React.Component<any, any> {
  static navigationOptions = {
    title: "Profile",
    headerTitle: "Profile"
  };

  render() {
    const { initiating, loading, account, username, images } = this.props;
    const displayImages = !loading && images && images.length;
    return !initiating ? (
      <View style={styles.container}>
        <AccountHeader address={account.address} username={username} />
        <View
          style={[styles.content, displayImages ? styles.displayImages : {}]}
        >
          {!loading ? (
            !displayImages ? (
              <Button width={200} onPress={this.props.accountImport}>
                Upload
              </Button>
            ) : (
              <FlatList
                contentContainerStyle={{
                  flexDirection: "row",
                  flexWrap: "wrap"
                }}
                data={images}
                keyExtractor={(image: any) => image.name}
                renderItem={(item: any) => (
                  <Image
                    style={{
                      padding: 10,
                      flex: 1,
                      height: WINDOW_WIDTH / 3,
                      width: WINDOW_WIDTH / 3
                    }}
                    resizeMode={"cover"}
                    source={{ uri: item.item.file }}
                  />
                )}
              />
            )
          ) : (
            <ActivityIndicator size="small" color="#a5a5a5" />
          )}
        </View>
      </View>
    ) : (
      <View style={styles.content}>
        <ActivityIndicator size="large" color="#a5a5a5" />
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
  displayImages: {
    flex: 1,
    width: "100%"
  },
  description: {
    fontSize: 18
  }
});

const reduxProps = (reduxState: any) => ({
  initiating: reduxState.account.initiating,
  loading: reduxState.account.loading,
  account: reduxState.account.account,
  username: reduxState.account.username,
  images: reduxState.account.images
});

export default connect(
  reduxProps,
  { accountImport }
)(AccountProfileScreen);
