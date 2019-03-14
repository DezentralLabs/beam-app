import * as React from "react";
import { Text, View, Image, StyleSheet } from "react-native";
import Card from "./Card";
import Section from "./Section";
// import { STATUSBAR_HEIGHT } from "../helpers/constants";

class AccountHeader extends React.Component<any, any> {
  render = () => {
    const { address, username } = this.props;
    return (
      <Card style={styles.card}>
        <View style={styles.row}>
          <Section style={styles.section}>
            {username && (
              <View style={styles.innerRow}>
                <Section style={styles.innerSectionOne}>
                  <Image
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      alignSelf: "flex-end"
                    }}
                    source={require("../assets/profile.jpeg")}
                  />
                </Section>
                <Section style={styles.innerSectionTwo}>
                  <Text style={styles.username}>{`@${username}`}</Text>
                  <Text
                    style={styles.monospace}
                    adjustsFontSizeToFit
                    numberOfLines={1}
                  >
                    {address}
                  </Text>
                </Section>
              </View>
            )}
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
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e9eaeb"
  },
  row: {
    height: 80,
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
  innerSectionOne: {
    // justifyContent: "center",
    width: "auto",
    height: "auto",
    flex: 2
  },
  innerSectionTwo: {
    width: "auto",
    height: "auto",
    flex: 8
  },
  username: {
    fontSize: 18,
    fontWeight: "600",
    paddingLeft: 15
  },
  monospace: {
    fontFamily: "Menlo-Regular",
    marginTop: 5,
    paddingLeft: 15
  }
});

export default AccountHeader;
