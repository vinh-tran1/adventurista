import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from 'react-native';

const Feed = () => {

  return (
    <View style={styles.container}>
        <Text>Welcome to Adventurista - Feed</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Feed;