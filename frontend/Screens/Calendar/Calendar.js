import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import axios from 'axios';
import Event from "./Event";

// Redux
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../Redux/userSlice';

const Calendar = () => {

  const user = useSelector(selectUserInfo);

  const API_URL = process.env.REACT_APP_AWS_API_URL + 'events/events-going-to/' + user.userId;
  console.log(API_URL)

  const [attending, setAttending] = useState([]);

  useEffect(() => {
    axios.get(API_URL)
      .then((response) => {
        setAttending(response.data);
        console.log("attending state: " + attending);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Itinerary</Text>
      </View>
      <ScrollView>
        <View style={styles.calendarContainer}>
          <Text style={styles.subheaderText}>Events Attending</Text>
          <Event />
          <Event />
          <Event />
        </View>
        <View style={styles.savedContainer}>
          <Text style={styles.subheaderText}>Saved Events</Text>
          <Event />
          <Event />
          <Event />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(0, 0, 0, 0.50)",
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15
  },
  calendarContainer: {
    paddingHorizontal: 20,
    marginTop: 15
  },
  subheaderText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15
  },
  savedContainer: {
    paddingHorizontal: 20,
    marginTop: 15
  }
});

export default Calendar;