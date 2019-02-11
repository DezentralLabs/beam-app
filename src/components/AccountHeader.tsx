import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import Card from "./Card";
import Section from "./Section";

class AccountHeader extends React.Component<any, any> {
  render = () => {
    const { address, username } = this.props;
    return (
      <Card style={styles.card}>
        <View style={styles.row}>
          <Section style={styles.section}>
            <View style={styles.innerRow}>
              <Section style={styles.innerSection}>
                <Text style={styles.bold}>{`@${username}`}</Text>

                <Text
                  style={styles.monospace}
                  adjustsFontSizeToFit
                  numberOfLines={1}
                >
                  {address || "Loading..."}
                </Text>
              </Section>
            </View>
          </Section>
        </View>
      </Card>
    );
  };
}

const styles = StyleSheet.create({
  card: {
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e9eaeb"
  },
  row: {
    height: 40,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 10,
    paddingTop: 0,
    paddingBottom: 0
  },
  section: {
    width: "auto",
    height: "auto",
    flex: 1
  },
  innerRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  innerSection: { width: "auto", height: "auto", flex: 10 },
  bold: { fontWeight: "600", paddingLeft: 10 },
  monospace: {
    fontFamily: "Menlo-Regular",
    paddingLeft: 10
  }
});

export default AccountHeader;
