import React from "react";
import { StyleSheet, Text, View } from 'react-native';

const BubbleText = (props) => {
  const { disabled } = props;
  const { title } = props;
  
  return (
    <View testID="bubble-text-container" style={[styles.container, disabled && styles.selectedTag]}>
        <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: "#EDDBFF",
    paddingHorizontal: 17.5,
    paddingVertical: 7.5,
    borderRadius: 20,
    marginRight: 7.5
  },
  title: {
    fontWeight: "bold",
    fontSize: 12
  },
  selectedTag: {
    alignItems: 'center',
    backgroundColor: '#D186FF', 
    paddingHorizontal: 17.5,
    paddingVertical: 7.5,
    borderRadius: 20,
    marginRight: 7.5
  }
});

export default BubbleText;