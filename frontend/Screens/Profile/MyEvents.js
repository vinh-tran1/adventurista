import React, { useEffect, useState } from "react";
import axios from "axios";
import { View, Text, StyleSheet} from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import EventCard from "../../Shared/EventCard";

import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../Redux/userSlice';


const MyEvents = ({ eventId }) => {

  const API_URL = process.env.REACT_APP_AWS_API_URL + 'events/event/' + eventId;
  const [event, setEvent] = useState("");
  const user = useSelector(selectUserInfo);

  useEffect(() => {
    axios.get(API_URL)
    .then((response) => {
      setEvent(response.data);
      console.log(event)
    })
    .catch((error) => {
      console.log("my event error")
      console.log(error);
    });
  }, [user])


  return (
    <View style={styles.eventsContainer}>
        {event && <EventCard event={event} privacy={false}/>}
    </View>
  );
}
  
const styles = StyleSheet.create({
  eventsContainer: {
    paddingHorizontal: 20,
    marginTop: 15
  },
});

export default MyEvents;
