import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from 'react-native';

const Post = () => {

  return (
    <View style={styles.container}>
        <Text>Welcome to Adventurista - Post</Text>
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

export default Post;