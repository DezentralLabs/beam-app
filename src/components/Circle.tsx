import * as React from "react";
import { View } from "react-native";

const Circle = (props: any) => {
  const { size, active } = props;
  const borderWidth = 2;
  const innerSize = size - borderWidth * 2;
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: borderWidth,
        borderColor: "#FFF",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <View
        style={{
          width: innerSize,
          height: innerSize,
          borderRadius: innerSize / 2,
          backgroundColor: active ? "#3b99fc" : "transparent"
        }}
      />
    </View>
  );
};

Circle.defaultProps = {
  size: 25,
  active: false
};

export default Circle;
