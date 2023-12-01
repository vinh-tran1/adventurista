import React, { useState } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import axios from "axios";

const Signup = ({ navigation }) => {

  const API_URL = process.env.REACT_APP_AWS_API_URL + 'users/auth/create-user';
  // console.log(API_URL)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");

  const handleSignup = async () => {
    try {
        const response = await axios.post(API_URL, {
        email: email,
        firstName: first,
        lastName: last,
        password: password
      });
      if (response.status === 201) {
        const user = response.data;
        navigation.navigate("Step 2", { user: user });
        console.log("Account successfully created!");
      } else {
        console.log("Error creating an account with this email");
      }
    } catch (err) {
      console.log(err);
      console.log("An error occurred while creating the account. Please try again.");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image style={styles.logo} source={require('../../../assets/logo.png')}/>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>First Name</Text>
        <TextInput testID="firstname" value={first} onChangeText={(text) => setFirst(text)} style={styles.input} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Last Name</Text>
        <TextInput testID="lastname" value={last} onChangeText={(text) => setLast(text)} style={styles.input} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput testID="email" value={email} onChangeText={(text) => setEmail(text)} style={styles.input} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput testID="password" value={password} onChangeText={(text) => setPassword(text)} style={styles.input} secureTextEntry={true} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity testID="signup" style={styles.signUpButton} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity testID="login" style={styles.signupContainer} onPress={() => navigation.navigate('Login Main')}>
        <Text style={styles.signup}>Already have an account? Log In!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  headerContainer: {
    marginBottom: 17.5,
    alignItems: "center"
  },
  // header: {
  //   fontSize: 25,
  //   fontWeight: "bold"
  // },
  logo: {
    height: 75,
    width: 250,
  },
  inputContainer: {
    paddingHorizontal: 40,
  },
  label: {
    marginVertical: 10,
    fontSize: 14,
    fontWeight: "bold"
  },
  input: {
    paddingVertical: 10,
    paddingLeft: 10,
    borderWidth: 0.25,
    borderColor: "#717171",
    marginBottom: 5,
    borderRadius: 10
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 20
  },
  signUpButton: {
    backgroundColor: "#CA75FF",
    paddingVertical: 10,
    width: 150,
    borderRadius: 10
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: "bold"
  },
  signupContainer: {
    alignItems: "center",
    marginTop: 17.5
  },
  signup: {
    fontWeight: "bold"
  }
});

export default Signup;