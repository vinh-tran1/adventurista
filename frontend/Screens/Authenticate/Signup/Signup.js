import React, { useState } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from "react-native";

// Redux
import { useDispatch } from "react-redux";
import { setUserInfo } from "../../../Redux/userSlice";

const Signup = ({ navigation }) => {

  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSignup = () => {
    dispatch(setUserInfo({
      id: '',
      name: name,
      email: email,
      username: username,
      phone_number: phone,
    }));
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {/* <Text style={styles.header}>Welcome to Adventurista!</Text> */}
        <Image style={styles.logo} source={require('../../../assets/logo.png')}/>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput value={name} onChangeText={(text) => setName(text)} style={styles.input} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Username</Text>
        <TextInput value={username} onChangeText={(text) => setUsername(text)} style={styles.input} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput value={password} onChangeText={(text) => setPassword(text)} style={styles.input} secureTextEntry={true} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput value={email} onChangeText={(text) => setEmail(text)} style={styles.input} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput value={phone} onChangeText={(text) => setPhone(text)} style={styles.input} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.signupContainer} onPress={() => navigation.navigate('Login Main')}>
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
    borderRadius: 15
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