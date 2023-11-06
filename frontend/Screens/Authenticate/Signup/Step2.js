import React, { useState } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Button } from "react-native";
import axios from "axios";

// Redux
import { useDispatch } from "react-redux";
import { setUserInfo } from "../../../Redux/userSlice";

const Step2 = ({ navigation, route }) => {

  const dispatch = useDispatch();

  const [interests, setInterests] = useState("");
  const [date, setDate] = useState(new Date());

  const { first_name, last_name, email } = route.params;

  const handleCompleteSignup = async () => {
    try {
      const response = await axios.post("https://qcdg4r1mc9.execute-api.us-east-1.amazonaws.com/auth/create-user", {
        interests: interests,
        age: age,
      });
      if (response.status === 201) {
        dispatch(setUserInfo({
          id: '',
          first_name: first_name,
          last_name: last_name,
          email: email,
        }));
        console.log("Interests and age added!");
      } else {
        console.log("Error adding interests and age!");
      }
    } catch (err) {
      console.log(err);
      console.log("An error occurred while adding your interests and age. Please try again.");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image style={styles.logo} source={require('../../../assets/logo.png')}/>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.signUpButton} onPress={handleCompleteSignup}>
          <Text style={styles.buttonText}>Complete Sign Up</Text>
        </TouchableOpacity>
      </View>
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
    marginTop: 20,
  },
  signUpButton: {
    backgroundColor: "#CA75FF",
    paddingVertical: 10,
    width: 200,
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

export default Step2;