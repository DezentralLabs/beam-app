import * as React from "react";
import { Image, StyleSheet, View, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { accountHideImage } from "../../redux/_account";
import { WINDOW_WIDTH } from "../../helpers/constants";

class ModalDisplay extends React.Component<any, any> {
  static navigationOptions = {
    title: "Display",
    headerTitle: "Display"
  };

  onHideImage = () => this.props.accountHideImage();

  render = () => {
    const { display } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          {display && (
            <TouchableOpacity onPress={this.onHideImage}>
              <Image
                style={{
                  flex: 1,
                  width: WINDOW_WIDTH
                }}
                resizeMode={"cover"}
                source={{ uri: display.file }}
              />
            </TouchableOpacity>
          )}
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
  }
});

const reduxProps = (reduxState: any) => ({
  display: reduxState.account.display
});

export default connect(
  reduxProps,
  { accountHideImage }
)(ModalDisplay);
