import * as React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
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
    const { loading, account, images } = this.props;
    const displayImages = !loading && images && images.length;
    return (
      <View style={styles.container}>
        <AccountHeader address={account.address} />

        {!displayImages && (
          <Text style={styles.description}>
            {loading ? "Uploading..." : "Upload your Instagram import"}
          </Text>
        )}
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
            <ActivityIndicator size="small" color="grey" />
          )}
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
  displayImages: {
    flex: 1,
    width: "100%"
  },
  description: {
    fontSize: 18
  }
});

const reduxProps = (reduxState: any) => ({
  loading: reduxState.account.loading,
  account: reduxState.account.account,
  images: reduxState.account.images
});

export default connect(
  reduxProps,
  { accountImport }
)(AccountProfileScreen);
