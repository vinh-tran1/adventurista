import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import axios from 'axios';
import EventCard from "../../Shared/EventCard";

// Redux
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../Redux/userSlice';

const Messages = () => {
  
  const user = useSelector(selectUserInfo);

  const API_URL = process.env.REACT_APP_AWS_API_URL + 'events/events-going-to/' + user.userId;

  const [groups, setGroups] = useState([]);

  useEffect(() => {
    axios.get(API_URL)
      .then((response) => {
        setGroups(response.data);
        console.log("DATAAAAA");
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>My Groups</Text>
      </View>
      <ScrollView>
        <View style={styles.groupsContainer}>
          <EventCard />
          <EventCard />
          <EventCard />
          <EventCard />
          <EventCard />
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
  groupsContainer: {
    paddingHorizontal: 20,
    marginTop: 15
  },
  subheaderText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15
  }
});

export default Messages;