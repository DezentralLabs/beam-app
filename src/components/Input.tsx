import * as React from "react";
import {
  StyleSheet,
  TextInput,
  RegisteredStyle,
  TextStyle,
  TextInputProps
} from "react-native";

interface IInputProps extends TextInputProps {
  onChange: any;
  value: any;
  width: number | string;
  style?: RegisteredStyle<TextStyle> | TextStyle;
}

const Input = (props: IInputProps) => (
  <React.Fragment>
    <TextInput
      style={[styles.input, { width: props.width }, props.style]}
      onChangeText={props.onChange}
      value={props.value}
      {...props}
    />
  </React.Fragment>
);

const styles = StyleSheet.create({
  input: {
    width: "100%",
    padding: 10,
    paddingLeft: 18,
    paddingRight: 18,
    borderColor: "#a5a5a5",
    borderRadius: 6,
    borderWidth: 1
  }
});

export default Input;
