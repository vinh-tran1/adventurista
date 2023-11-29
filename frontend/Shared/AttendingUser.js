import React, {useState, useEffect} from "react";
import { View, Text, FlatList, SafeAreaView, Image, TextInput, TouchableOpacity, ScrollView, StyleSheet} from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import axios from "axios";

const AttendingUser = (props) => {

  const { user } = props;

  // need to get user with api call and use effect

  return (
    <TouchableOpacity style={styles.request}>
        <View style={{ flexDirection: "row" }}>
            <Image source={{uri: "https://media.licdn.com/dms/image/C4D03AQGMfYOlb4UFaw/profile-displayphoto-shrink_800_800/0/1643655076107?e=1706745600&v=beta&t=jDcDuLbtio29INiWjdd2az7wXwGOEpENa9MPqPH5pvo"}} style={styles.profilePic}/>
            <Text style={{ fontWeight: "bold", fontSize: 18, marginTop: 12.5, marginLeft: 12.5 }}>{user.firstName} {user.lastName}</Text>
        </View>
        <TouchableOpacity style={styles.button}>
            <FontAwesomeIcon testID='user-plus-icon' style={{ marginLeft: 10, marginTop: 10 }} icon="user-plus" size={20} color="#D186FF"/>
        </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    flexDirection: "row",
    marginTop: 10,
    paddingHorizontal: 20
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 10,
    marginTop: 4
  },
  request: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    borderTopWidth: 0.25,
    paddingVertical: 12.5
  },
  profilePic: {
    height: 50,
    width: 50,
    borderRadius: 150/2,
    borderWidth: 2,
    borderColor: '#EDD3FF'
  },
  button: {
    height: 40, // Set a fixed height
    width: 40, // Set a fixed width
    borderRadius: 20, // Half of the height/width to make it a circle
    borderColor: "#D186FF",
    borderWidth: 0.5,
    marginHorizontal: 5
  }
});

export default AttendingUser;