import * as React from "react";
import { Text, View } from "react-native";
import Card from "./Card";
import Section from "./Section";

class AccountHeader extends React.Component<any, any> {
  render = () => {
    const { address } = this.props;
    return (
      <Card
        style={{
          paddingTop: 10,
          paddingBottom: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#e9eaeb"
        }}
      >
        <View
          style={{
            height: 40,
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            padding: 10,
            paddingTop: 0,
            paddingBottom: 0
          }}
        >
          <Section style={{ width: "auto", height: "auto", flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center"
              }}
            >
              <Section style={{ width: "auto", height: "auto", flex: 10 }}>
                <Text
                  style={{ fontFamily: "Menlo-Regular", paddingLeft: 10 }}
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

export default AccountHeader;
