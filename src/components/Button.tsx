import * as React from "react";
import { TouchableHighlight, Text, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  button: {
    position: "relative",
    height: 35,
    borderRadius: 6,
    marginTop: 20,
    marginLeft: "auto",
    marginRight: "auto",
    alignSelf: "stretch",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  label: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.4,
    textAlign: "center"
  }
});

interface IButtonProps {
  children: React.ReactNode;
  onPress: any;
  color: string;
  width: number | string;
}

const Button = (props: IButtonProps) => {
  const { color, children, width } = props;
  return (
    <TouchableHighlight
      style={[styles.button, { backgroundColor: color, width: width }]}
      {...props}
    >
      <Text style={styles.label}>{children}</Text>
    </TouchableHighlight>
  );
};

Button.defaultProps = {
  width: "100%",
  color: "#3b99fc"
};

export default Button;
