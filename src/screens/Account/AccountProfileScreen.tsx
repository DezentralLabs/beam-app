import * as React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";
import { accountImport, accountDisplayImage } from "../../redux/_account";
import AccountHeader from "../../components/AccountHeader";
import Button from "../../components/Button";
import { WINDOW_WIDTH } from "../../helpers/constants";
import { IFileJson } from "../../helpers/types";

class AccountProfileScreen extends React.Component<any, any> {
  static navigationOptions = {
    title: "Profile",
    headerTitle: "Profile"
  };

  componentDidMount() {
    if (!this.props.initiating) {
      StatusBar.setBarStyle("light-content", true);
    }
  }

  componentDidUpdate(prevProps: any) {
    if (!this.props.initiating && prevProps.initiating) {
      StatusBar.setBarStyle("light-content", true);
    } else if (this.props.initiating && !prevProps.initiating) {
      StatusBar.setBarStyle("default", true);
    }
    if (!this.props.display && prevProps.display) {
      StatusBar.setBarStyle("light-content", true);
    } else if (this.props.display && !prevProps.display) {
      StatusBar.setBarStyle("default", true);
    }
  }

  componentWillUnmount() {
    StatusBar.setBarStyle("default", true);
  }

  onDisplayImage = (fileJson: IFileJson) => {
    this.props.accountDisplayImage(fileJson);
  };

  render() {
    const {
      initiating,
      uploading,
      loading,
      username,
      selected,
      images
    } = this.props;
    const displayImages = !loading && images.length;
    const uploadingTotal = selected.length;
    const uploadingLeft = selected.length - images.length;
    return !initiating ? (
      <View style={styles.container}>
        <AccountHeader username={username} />
        <View
          style={[styles.content, displayImages ? styles.displayImages : {}]}
        >
          {!images.length ? (
            !loading ? (
              <Button width={200} onPress={this.props.accountImport}>
                Import
              </Button>
            ) : (
              <ActivityIndicator size="small" color="#a5a5a5" />
            )
          ) : (
            <FlatList
              contentContainerStyle={{
                width: WINDOW_WIDTH,
                justifyContent: "flex-start",
                flexDirection: "row",
                flexWrap: "wrap"
              }}
              data={images}
              keyExtractor={(image: any) => image.name}
              renderItem={(item: any) => (
                <TouchableOpacity
                  onPress={() => this.onDisplayImage(item.item)}
                >
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
                </TouchableOpacity>
              )}
            />
          )}
        </View>
        {images.length && (
          <View
            style={{
              width: WINDOW_WIDTH,
              height: 80,
              position: "absolute",
              bottom: 0,
              backgroundColor: "white",
              paddingTop: 10,
              justifyContent: "center"
            }}
          >
            {!uploading ? (
              <Button width={200} onPress={this.props.accountImport}>
                Import
              </Button>
            ) : (
              <Text style={{ fontWeight: "600", textAlign: "center" }}>
                {`Uploading ${uploadingLeft} out of ${uploadingTotal}`}
              </Text>
            )}
          </View>
        )}
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
  uploading: reduxState.account.uploading,
  loading: reduxState.account.loading,
  username: reduxState.account.username,
  selected: reduxState.account.selected,
  images: reduxState.account.images,
  display: reduxState.account.display
});

export default connect(
  reduxProps,
  { accountImport, accountDisplayImage }
)(AccountProfileScreen);
