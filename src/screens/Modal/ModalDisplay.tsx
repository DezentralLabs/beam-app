import * as React from "react";
import { Image, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import { accountHideImage } from "../../redux/_account";
import { WINDOW_WIDTH } from "../../helpers/constants";

class ModalDisplay extends React.Component<any, any> {
  static navigationOptions = {
    title: "Display",
    headerTitle: "Display"
  };

  render = () => {
    const { display } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Image
            style={{
              padding: 10,
              flex: 1,
              height: WINDOW_WIDTH - 10,
              width: WINDOW_WIDTH - 10
            }}
            resizeMode={"cover"}
            source={{ uri: display.file }}
          />
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
