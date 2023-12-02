import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import axios from 'axios';
import EventCard from "../../Shared/EventCard";

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { selectUserInfo } from '../../Redux/userSlice';

const Calendar = ({ navigation }) => {

  const user = useSelector(selectUserInfo);

  const API_URL = process.env.REACT_APP_AWS_API_URL + 'events/events-going-to/' + user.userId;

  const [attending, setAttending] = useState([]);

  useEffect(() => {
    axios.get(API_URL)
      .then((response) => {
        setAttending(response.data);
        // console.log("attending event:", attending);
      })
      .catch((error) => {
        console.log("getting attending events failed")
        console.log(error);
      });
  }, [user?.eventsGoingTo || []]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Itinerary</Text>
      </View>
      <ScrollView>
        <View style={styles.calendarContainer}>
          {attending.length > 0 && <Text style={styles.subheaderText}>Events Attending</Text>}
          { attending.length > 0 ?
            attending.map((eventObj, index) => {
            return (
              <EventCard key={index} event={eventObj} privacy={false} navigation={navigation}/>
            )
            })
            :
            <Text style={{ fontSize: 24, fontWeight: '700', color: 'gray' }}>
              no events on itinerary!
            </Text>
          }
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