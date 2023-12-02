import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import axios from 'axios';
import EventCard from "../../Shared/EventCard";

// Redux
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../Redux/userSlice';

const Calendar = () => {

  const user = useSelector(selectUserInfo);

  const ATTEND_API_URL = process.env.REACT_APP_AWS_API_URL + 'events/events-going-to/' + user.userId;

  const [attending, setAttending] = useState([]);

  useEffect(() => {
    axios.get(ATTEND_API_URL)
      .then((response) => {
        setAttending(response.data);
        console.log("attending:", attending);
        //console.log("attending state: " + attending);
      })
      .catch((error) => {
        console.log(error);
      });
<<<<<<< HEAD

      axios.get(SAVE_API_URL)
      .then((response) => {
        setSaved(response.data.eventsSaved);
        console.log("saved: ", saved);
        //console.log("saved state: " + saved);
      })
      .catch((error) => {
        console.log(error);
      });

      // filter arrays chronologically

  }, [user.eventsSaved]);
=======
  }, []);
>>>>>>> 9bc7512be9fec4f6958c28ecc828005a546fa1f3

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Itinerary</Text>
      </View>
      <ScrollView>
        <View style={styles.calendarContainer}>
          <Text style={styles.subheaderText}>Events Attending</Text>
          <EventCard attending={attending[0]} />
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