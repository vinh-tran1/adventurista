import React, { useEffect, useState } from "react";
import { View, Text, FlatList, SafeAreaView, Image, TextInput, TouchableOpacity, ScrollView, StyleSheet} from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Post from "./Post";
import FeedFixedTop from "./FeedFixedTop";

// fetch posts api
// const [posts, setPosts] = useState(null);
// useEffect(() => {
//   // Function to make the GET request
//   const getPosts = async () => {
//     try {
//       const response = await fetch(url);
//       const jsonData = await response.json();

//       // Update state with the fetched data
//       setPosts(jsonData);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   getPosts();
// }, []); 

// sample posts data
const DATA = [
  {
    id: '1',
    title: 'Hallowoads',
    location: '300 York St, New Haven',
    date: 'Wed, Oct 25',
    time: '10:30 PM',
    caption: "This is a description of the event. Buy tickets on Toad's website!",
    tags: ['club', 'yale', 'holiday'],
    img: 'https://s.hdnux.com/photos/64/42/33/13772497/4/1200x0.jpg',
    createdBy: 'Nikhil'
  },
  {
    id: '2',
    title: 'Night Markets',
    location: 'Chapel St, New Haven',
    date: 'Wed, Oct 25',
    time: '10:30 PM',
    caption: 'Food, food, and more food. Come to Chapel Street for the best street food market in New Haven!',
    tags: ['pop-up', 'yale', 'food'],
    img: 'https://s.hdnux.com/photos/01/34/46/27/24274379/3/1200x0.jpg',
    createdBy: 'Vinh'
  }
];

const Feed = () => {
  return (
    <SafeAreaView style={styles.container}>
      <FeedFixedTop />
      <FlatList
        data={DATA}
        renderItem={({ item }) => 
          <Post 
            title={item.title} 
            location={item.location}
            date={item.date}
            time={item.time}
            caption={item.caption} 
            tags={item.tags}
            img={item.img}
            createdBy={item.createdBy}
          />}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});

export default Feed;