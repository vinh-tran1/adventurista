import React, { useState } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import axios from "axios";

// Redux
import { useDispatch } from "react-redux";
import { setUserInfo } from "../../../Redux/userSlice";

const Login = ({ navigation }) => {

  const API_URL = process.env.REACT_APP_AWS_API_URL + 'users/auth/sign-in';
  // console.log(API_URL)
  // const API_URL = 'https://8ly1bceyw5.execute-api.us-east-1.amazonaws.com/users/auth/sign-in'
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      // const response = await axios.post("https://weaapwe0j9.execute-api.us-east-1.amazonaws.com/users/auth/sign-in", {
        const response = await axios.post(API_URL, {
        email: email,
        password: password
      });
      if (response.status === 200) {
        const user = response.data;
        dispatch(setUserInfo({
          newPost: false,
          userId: user.userId,
          age: user.age,
          blockedUsers: user.blockedUsers,
          email: user.email,
          eventsGoingTo: user.eventsGoingTo,
          eventsNotGoingTo: user.eventsNotGoingTo,
          eventsOwned: user.eventsOwned,
          firstName: user.firstName,
          lastName: user.lastName,
          friends: user.friends,
          groups: user.groups,
          interests: user.interests,
          messages: user.messages,
          primaryLocation: user.primaryLocation,
          profilePictureUrl: user.profilePictureUrl,
          bannerPictureUrl: user.bannerImageUrl,
          bio: user.bio,
          requests: user.requests
        }));
        console.log("Login successful!");
      } else {
        console.log("Error logging in with this email");
      }
    } catch (err) {
      console.log(err);
      console.log("An error occurred while logging in with this account. Please try again.");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image style={styles.logo} source={require('../../../assets/logo.png')}/>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput value={email} onChangeText={(text) => setEmail(text)} style={styles.input} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput value={password} onChangeText={(text) => setPassword(text)} style={styles.input} secureTextEntry={true} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.signupContainer} onPress={() => navigation.navigate('Signup Main')}>
        <Text style={styles.signup}>Don't have an account? Sign up!</Text>
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
  loginButton: {
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

export default Login;