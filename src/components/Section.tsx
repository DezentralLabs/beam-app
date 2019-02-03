import * as React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

interface ISectionProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const Section = (props: ISectionProps) => (
  <View style={[styles.section, props.style]} {...props}>
    {props.children}
  </View>
);

const styles = StyleSheet.create({
  section: {
    borderBottomWidth: 1,
    borderColor: "#ddd",
    padding: 5,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
    flexDirection: "row",
    position: "relative"
  }
});

export default Section;
