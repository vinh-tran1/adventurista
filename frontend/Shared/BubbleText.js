import React from "react";
import { StyleSheet, Text, View } from 'react-native';

const BubbleText = (props) => {

  const { title } = props;

  return (
    <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#EDDBFF",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    width: 80,
    marginRight: 7.5
  },
  title: {
    fontWeight: "bold",
    fontSize: 13
  }
});

export default BubbleText;