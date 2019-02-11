import * as React from "react";
import { TouchableOpacity, Image, StyleSheet, View } from "react-native";
import Circle from "./Circle";
import { WINDOW_WIDTH } from "../helpers/constants";

class SelectableImage extends React.Component<any, any> {
  state = {
    selected: false
  };

  onPress = (item: any) => {
    this.setState({ selected: !this.state.selected });
    console.log("SelectableImage onPress item", item);
    this.props.onSelected(item);
  };

  render = () => {
    const { item } = this.props;
    return (
      <TouchableOpacity onPress={() => this.onPress(item)}>
        <View
          style={{
            flex: 1,
            height: WINDOW_WIDTH / 3,
            width: WINDOW_WIDTH / 3
          }}
        >
          <View style={styles.backgroundContainer}>
            <Image
              style={{
                flex: 1,
                height: WINDOW_WIDTH / 3,
                width: WINDOW_WIDTH / 3
              }}
              resizeMode={"cover"}
              source={{ uri: item.file }}
            />
          </View>
          <View
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-end",
              padding: 4
            }}
          >
            <Circle active={this.state.selected} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  backgroundContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }
});

export default SelectableImage;
