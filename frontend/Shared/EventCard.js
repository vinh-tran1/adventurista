import React, { useEffect, useState } from "react";
import axios from "axios";
import { ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation } from '@react-navigation/native';

import { useSelector } from 'react-redux';
import { selectUserInfo } from '../Redux/userSlice';

const EventCard = (props) => {

  const API_URL = process.env.REACT_APP_AWS_API_URL + 'users/';
  const { event, privacy } = props;
  const navigation = useNavigation();
  const[poster, setPoster] = useState("");
  const user = useSelector(selectUserInfo);

  useEffect(() => {
    // console.log(user.userId)
    axios.get(API_URL + event.postingUserId) 
    .then((response) => {
        setPoster(response.data);
        // console.log(poster)
    })
    .catch((error) => {
        console.log("event card error")
        console.log(error);
    });
}, [user]);

  return (
    <View >
      <ImageBackground source={{uri: event.eventPictureUrl}} style={styles.container}>
          <View style={styles.postHeader}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{fontSize: 18, fontWeight: "bold", marginTop: 2.5}}>{event.title}</Text>
                  <TouchableOpacity onPress={() => navigation.navigate("Event Details", {event: event, poster: poster, privacy: privacy})}>
                      <FontAwesomeIcon style={{ marginTop: 5, marginRight: 5 }} icon="fa-right-from-bracket" size={20} />
                  </TouchableOpacity>
              </View>
              <View style={styles.locationContainer}>
                  <FontAwesomeIcon style={{ marginRight: 5 }} color={"#D186FF"} icon="location-dot" size={15} />
                  <Text style={{ fontWeight: "bold", fontSize: 12 }}>{event.location}</Text>
              </View>
          </View>
          <View style={styles.bottomContent}>
              <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                  <View>
                      <View style={{ flexDirection: "row" }}>
                          <View style={{ backgroundColor: "#D186FF", borderRadius: 20, borderWidth: 0.5, borderColor: 'white', width: 25, height: 25 }}>
                              <FontAwesomeIcon style={{ marginLeft: 6, marginTop: 5 }} icon="user" size={13} />
                          </View>
                          <Text style={{ fontSize: 12, fontWeight: "bold", color: "white", marginLeft: 5, marginTop: 7.5 }}>+ {event?.whoIsGoing?.length || 0} Others</Text>
                      </View>
                      <Text style={{ fontSize: 12, color: "white", fontWeight: "bold" }}>by {poster.firstName}</Text>
                  </View>
                  <View style={{ marginTop: 5 }}>
                      <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>{event.date}</Text>
                      <Text style={{ color: "white", textAlign: "center", fontSize: 13 }}>{event.time}</Text>
                  </View>
              </View>
          </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 125,
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden'
  },
  postHeader: {
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    paddingVertical: 2.5,
    paddingHorizontal: 10,
  },
  locationContainer: {
    flexDirection: "row",
    backgroundColor: 'rgba(255, 255, 255, 0.80)',
    marginVertical: 5,
    padding: 5,
    borderRadius: 5,
    width: "60%"
  },
  bottomContent: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 10,
    marginHorizontal: 15,
  }
});

export default EventCard;