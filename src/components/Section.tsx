import * as React from "react";
import { StyleSheet, View } from "react-native";

interface ISectionProps {
  children: React.ReactNode;
}

const Section = (props: ISectionProps) => (
  <View style={styles.section} {...props}>
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
