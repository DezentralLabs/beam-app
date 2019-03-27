import * as React from "react";
import { FlatList, StyleSheet, View, ActivityIndicator } from "react-native";
import { connect } from "react-redux";
import Button from "../../components/Button";
import SelectableImage from "../../components/SelectableImage";
import { accountUpdateSelected, accountUpload } from "../../redux/_account";
import { IFileJson } from "../../helpers/types";
import { WINDOW_WIDTH } from "../../helpers/constants";

class ModalImport extends React.Component<any, any> {
  static navigationOptions = {
    title: "Import",
    headerTitle: "Import"
  };

  onSelected = (file: IFileJson) => {
    console.log("[onSelected] file", file);
    this.props.accountUpdateSelected(file);
  };

  onClose = () => {
    this.props.navigation.goBack(null);
  };

  render = () => {
    const { loading, imported } = this.props;
    const displayImages = !loading && imported && imported.length;

    return (
      <View style={styles.container}>
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
                  width: WINDOW_WIDTH,
                  justifyContent: "flex-start",
                  flexDirection: "row",
                  flexWrap: "wrap"
                }}
                data={imported}
                keyExtractor={(image: any) => image.name}
                renderItem={(item: any) => (
                  <SelectableImage
                    item={item.item}
                    onSelected={this.onSelected}
                  />
                )}
              />
            )
          ) : (
            <ActivityIndicator size="small" color="#a5a5a5" />
          )}
        </View>
        <View
          style={{
            width: WINDOW_WIDTH,
            height: 80,
            position: "absolute",
            bottom: 0,
            backgroundColor: "white",
            paddingTop: 10
          }}
        >
          <Button width={200} onPress={this.props.accountUpload}>
            Upload
          </Button>
        </View>
      </View>
    );
  };
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
  account: reduxState.account.account,
  imported: reduxState.account.imported,
  selected: reduxState.account.selected
});

export default connect(
  reduxProps,
  { accountUpdateSelected, accountUpload }
)(ModalImport);
