import * as React from "react";
import { Text, View, Image, StyleSheet } from "react-native";
import Card from "./Card";
import Section from "./Section";
import { STATUSBAR_HEIGHT } from "../helpers/constants";

class AccountHeader extends React.Component<any, any> {
  render = () => {
    const { username } = this.props;
    return (
      <Card style={styles.card}>
        <View style={styles.row}>
          <Section style={styles.section}>
            <View style={styles.innerRow}>
              <Section>
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
              <Section>
                <Text style={styles.username}>{`@${username}`}</Text>
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
    paddingTop: STATUSBAR_HEIGHT ? STATUSBAR_HEIGHT + 10 : 30,
    paddingBottom: 10,
    backgroundColor: "#3b99fc",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
    // borderBottomWidth: 1,
    // borderBottomColor: "#e9eaeb"
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
    justifyContent: "center",
    alignItems: "center"
  },
  username: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    paddingLeft: 10
  },
  monospace: {
    fontFamily: "Menlo-Regular",
    paddingLeft: 10
  }
});

export default AccountHeader;
