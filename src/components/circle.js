import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export const Circle = function(props) {
  const text = props.text;
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.circle}>
        <Text style={styles.circleText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: 75,
    height: 75,
    borderRadius: 75 / 2,
    backgroundColor: "#00BCD4",
    margin: 10,
    marginRight: 5,
    justifyContent: "center"
  },
  circleText: {
    textAlign: "center",
    fontSize: 15
  }
});
