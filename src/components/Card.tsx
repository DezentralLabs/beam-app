import * as React from "react";
import { StyleSheet, View } from "react-native";

interface ICardProps {
  children: React.ReactNode;
}

const Card = (props: ICardProps) => (
  <View style={styles.card} {...props}>
    {props.children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: "#ddd",
    borderBottomWidth: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    elevation: 1,
    marginTop: 10,
    marginRight: 5,
    marginBottom: 0,
    marginLeft: 5
  }
});

export default Card;
