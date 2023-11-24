import React from "react";
import { View, Text, FlatList, SafeAreaView, Image, TextInput, TouchableOpacity, ScrollView, StyleSheet} from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

const FollowRequest = () => {

  const profilePic = 'https://media.licdn.com/dms/image/C4D03AQGMfYOlb4UFaw/profile-displayphoto-shrink_800_800/0/1643655076107?e=2147483647&v=beta&t=v3YTetBWO8TOjEv-7hxNvsOdQWswiQT1DoGAJ7PNlDY'

  const handleConfirmFriend = () => {
    // call API endpoint to accept friend request
  }

  return (
    <TouchableOpacity style={styles.request} onPress={handleConfirmFriend}>
        <View style={{ flexDirection: "row" }}>
            <Image source={{uri: profilePic}} style={styles.profilePic}/>
            <Text style={{ fontWeight: "bold", fontSize: 16, marginTop: 12.5, marginLeft: 12.5 }}>Nikhil Ismail</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
            <TouchableOpacity style={styles.button}>
                <FontAwesomeIcon style={{ marginLeft: 6, marginTop: 7 }} icon="fa-check" size={25} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
                <FontAwesomeIcon style={{ marginLeft: 6, marginTop: 7 }} icon="fa-xmark" size={25} />
            </TouchableOpacity>
        </View>
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
    borderTopWidth: 0.5,
    paddingVertical: 12.5
  },
  profilePic: {
    height: 50,
    width: 50,
    borderRadius: 150/2,
  },
  button: {
    height: 40, // Set a fixed height
    width: 40, // Set a fixed width
    borderRadius: 20, // Half of the height/width to make it a circle
    borderColor: "black",
    borderWidth: 0.5,
    marginHorizontal: 5
  }
});

export default FollowRequest;