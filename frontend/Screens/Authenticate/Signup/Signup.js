import React, { useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

// Redux

const Signup = ({ navigation }) => {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Adventurista!</Text>
      <TouchableOpacity style={styles.buttonContainer}>
        <Text style={styles.buttonText}>Log in with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonContainer}>
        <Text style={styles.buttonText}>Log in with Apple</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonContainer}>
        <Text style={styles.buttonText}>Log in with Outlook</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.signupContainer} onPress={() => navigation.navigate('Login Main')}>
        <Text style={styles.signupText}>Don’t Have An Account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 35,
    },
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12.5,
      paddingHorizontal: 15,
      marginBottom: 15,
      borderRadius: 15,
      borderWidth: 1
    },
    buttonIcon: {
      width: 24,
      height: 24,
      marginRight: 10,
      color: "#03254C"
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "bold"
    },
    signupContainer: {
      marginTop: 20
    },
    signupText: {
      fontSize: 14,
      fontWeight: "bold"
    }
  });

export default Signup;