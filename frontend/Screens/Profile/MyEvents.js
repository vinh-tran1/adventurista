import React, { useEffect, useState } from "react";
import { View, Text, FlatList, SafeAreaView, Image, TextInput, TouchableOpacity, ScrollView, StyleSheet} from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import IndividualPost from "./IndividualPost";


// sample posts data
const DATA = [
  {
    id: '1',
    title: 'Hallowoads',
    location: '300 York St, New Haven',
    date: 'Wed, Oct 25',
    time: '10:30 PM',
    img: 'https://s.hdnux.com/photos/64/42/33/13772497/4/1200x0.jpg',

  },
  {
    id: '2',
    title: 'Night Markets',
    location: 'Chapel St, New Haven',
    date: 'Wed, Oct 25',
    time: '10:30 PM',
    img: 'https://s.hdnux.com/photos/01/34/46/27/24274379/3/1200x0.jpg',
  },
  {
    id: '3',
    title: 'Hallowoads',
    location: '300 York St, New Haven',
    date: 'Wed, Oct 25',
    time: '10:30 PM',
    img: 'https://s.hdnux.com/photos/64/42/33/13772497/4/1200x0.jpg',

  },
  {
    id: '4',
    title: 'Night Markets',
    location: 'Chapel St, New Haven',
    date: 'Wed, Oct 25',
    time: '10:30 PM',
    img: 'https://s.hdnux.com/photos/01/34/46/27/24274379/3/1200x0.jpg',
  },
  {
    id: '5',
    title: 'Hallowoads',
    location: '300 York St, New Haven',
    date: 'Wed, Oct 25',
    time: '10:30 PM',
    img: 'https://s.hdnux.com/photos/64/42/33/13772497/4/1200x0.jpg',
  },
  {
    id: '6',
    title: 'Night Markets',
    location: 'Chapel St, New Haven',
    date: 'Wed, Oct 25',
    time: '10:30 PM',
    img: 'https://s.hdnux.com/photos/01/34/46/27/24274379/3/1200x0.jpg',
  },
];

const MyEvents = () => {
    return (
      <View style={styles.container}>
        {DATA.map(item => (
          <IndividualPost
            key={item.id}
            title={item.title}
            location={item.location}
            img={item.img}
            date={item.date}
            time={item.time}
          />
        ))}
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: 10
    }
  });

export default MyEvents;
