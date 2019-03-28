import * as React from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  RegisteredStyle
} from "react-native";

const styles = StyleSheet.create({
  button: {
    position: "relative",
    height: 35,
    borderRadius: 6,
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
    textAlign: "center",
    lineHeight: 22
  }
});

interface IButtonProps {
  children: React.ReactNode;
  onPress: any;
  loading?: boolean;
  color: string;
  width: number | string;
  style?: RegisteredStyle<ViewStyle> | ViewStyle;
}

const Button = (props: IButtonProps) => {
  const { loading, color, children, width } = props;
  console.log("[Button] width", width);
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: color, width: width },
        props.style
      ]}
      {...props}
    >
      {!loading ? (
        <Text style={styles.label}>{children}</Text>
      ) : (
        <ActivityIndicator size="small" color="white" />
      )}
    </TouchableOpacity>
  );
};

Button.defaultProps = {
  width: "100%",
  color: "#3b99fc"
};

export default Button;
