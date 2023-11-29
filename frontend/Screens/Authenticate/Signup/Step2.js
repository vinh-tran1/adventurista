import React, { useState } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Button } from "react-native";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import BubbleText from '../../../Shared/BubbleText';

// Redux
import { useDispatch } from "react-redux";
import { setUserInfo } from "../../../Redux/userSlice";

const Step2 = ({ navigation, route }) => {

  const API_URL = process.env.REACT_APP_AWS_API_URL + 'users/update-user-age-interests-location';
  // console.log(API_URL)

  const dispatch = useDispatch();

  const [interests, setInterests] = useState([]);
  const [tempInterest, setTempInterest] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");

  const { user } = route.params;

  const handleCompleteSignup = async () => {
    try {
      // const response = await axios.post("https://weaapwe0j9.execute-api.us-east-1.amazonaws.com/users/update-user-age-interests-location", {
        const response = await axios.post(API_URL, {
        userId: user.userId,
        age: age,
        interests: interests,
        primaryLocation: location
      });
      if (response.status === 200) {
        const updatedUser = response.data;
        dispatch(setUserInfo({
            newPost: false,
            userId: updatedUser.userId,
            age: updatedUser.age,
            blockedUsers: updatedUser.blockedUsers,
            email: updatedUser.email,
            eventsGoingTo: updatedUser.eventsGoingTo,
            eventsNotGoingTo: updatedUser.eventsNotGoingTo,
            eventsOwned: updatedUser.eventsOwned,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            friends: updatedUser.friends,
            groups: updatedUser.groups,
            interests: updatedUser.interests,
            messages: updatedUser.messages,
            primaryLocation: updatedUser.primaryLocation,
            profilePictureUrl: updatedUser.profilePictureUrl,
            bannerImageUrl: updatedUser.bannerImageUrl,
            bio: updatedUser.bio,
            requests: updatedUser.requests
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

  const handleAddInterest = () => {
      let updated = interests;
      updated.push(tempInterest);
      setInterests(updated);
      setTempInterest("");
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image style={styles.logo} source={require('../../../assets/logo.png')}/>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Date of Birth (YYYY-MM-DD)</Text>
        <TextInput value={age} placeholder="2001-09-10" onChangeText={(text) => setAge(text)} style={styles.input} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Where Are You Currently?</Text>
        <TextInput value={location} placeholder="New Haven, United States" onChangeText={(text) => setLocation(text)} style={styles.input} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>What Are Your Interests? {interests.length === 3 ? "" : "(" + (3 - interests.length) + " Required)"}</Text>
        {interests.length < 3 &&
        <View style={{ flexDirection: "row" }}>
            <TextInput value={tempInterest} onChangeText={(text) => setTempInterest(text)} placeholder='i.e. food' style={styles.input} />
            <TouchableOpacity onPress={handleAddInterest}>
                <FontAwesomeIcon style={{ marginTop: 5, marginLeft: 15 }} icon="fa-add" size={25} />
            </TouchableOpacity>
        </View>
        }
        <View style={{ flexDirection: "row", paddingTop: 10 }}>
            {interests.length > 0 && interests.map((tag, index) => {
                return (
                    <BubbleText key={index} title={tag} />
                );
            })}
            {interests.length === 3 &&
            <TouchableOpacity onPress={() => setInterests([])}>
                <FontAwesomeIcon style={{ marginTop: 2.5, marginLeft: 15 }} icon="fa-xmark" size={25} />
            </TouchableOpacity>
            }
        </View>
      </View>
      <View style={{ alignItems: "center", marginTop: interests.length === 3 ? 30 : 20 }}>
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
    borderRadius: 10,
    width: 275
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