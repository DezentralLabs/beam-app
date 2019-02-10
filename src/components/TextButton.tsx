import * as React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  RegisteredStyle,
  TextStyle
} from "react-native";

const styles = StyleSheet.create({
  button: {
    position: "relative",
    backgroundColor: "transparent",
    marginLeft: "auto",
    marginRight: "auto",
    alignSelf: "stretch",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  label: {
    fontSize: 16,
    letterSpacing: 0.4,
    textAlign: "center"
  }
});

interface ITextButtonProps {
  children: React.ReactNode;
  onPress: any;
  color: string;
  width: number | string;
  style?: RegisteredStyle<TextStyle> | TextStyle;
}

const TextButton = (props: ITextButtonProps) => {
  const { color, children, width } = props;
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: color, width: width },
        props.style
      ]}
      {...props}
    >
      <Text style={[styles.label, { color: color }, props.style]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

TextButton.defaultProps = {
  width: "100%",
  color: "#1b1f2399"
};

export default TextButton;
