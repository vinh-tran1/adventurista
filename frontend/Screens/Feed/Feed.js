import React, { useEffect, useState } from "react";
import { View, Text, FlatList, SafeAreaView, Image, TextInput, TouchableOpacity, ScrollView, StyleSheet} from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Post from "./Post";

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
    caption: 'Caption 1',
    img: 'https://s.hdnux.com/photos/64/42/33/13772497/4/1200x0.jpg',
    createdBy: 'Nikhil'
  },
  {
    id: '2',
    title: 'Night Markets',
    location: 'Chapel St, New Haven',
    date: 'Wed, Oct 25',
    time: '10:30 PM',
    caption: 'Caption 2',
    img: 'https://dxbhsrqyrr690.cloudfront.net/sidearm.nextgen.sites/yalebulldogs.com/images/2022/1/28/SAM_5155.JPG',
    createdBy: 'Vinh'
  },
  {
    id: '3',
    title: 'College Squash Nationals',
    location: 'Arlen Specter Center',
    date: 'Wed, Oct 25',
    time: '10:30 PM',
    caption: 'Caption 3',
    img: 'https://csasquash.com/wp-content/uploads/02068_MTB_2022_MCSANTC_2022-02-19-1024x682.jpg',
    createdBy: 'Nikhil'
  },
];

const Feed = () => {
  return (
    <SafeAreaView style={styles.container}>
     {/* fixed top menu */}
      <View style={styles.header}>
        <Image style={styles.logo} source={require('../../assets/logo.png')}/>
      </View>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.location}>
          <FontAwesomeIcon style={{ marginRight: 5 }} color={"#D186FF"} icon="location-pin" size={20} />
          <Text style={{ marginTop: 2, fontSize: 13 }}>New Haven, CT</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: 7.5 }}>
          <FontAwesomeIcon color={"#D99BFF"} icon="magnifying-glass" size={20} />
        </TouchableOpacity>
      </View>

       {/* rendering posts */}
      <FlatList
        data={DATA}
        renderItem={({ item }) => 
          <Post 
            title={item.title} 
            location={item.location}
            date={item.date}
            time={item.time}
            caption={item.caption} 
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
  },
  header: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 5,
    borderBottomWidth: 0.25
  },
  topBar: {
    paddingHorizontal: 20,
    marginVertical: 12.5,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  logo: {
    height: 60,
    width: 200,
  },
  location: {
    flexDirection: "row",
    backgroundColor: "#F3E8FF",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 5
  },

});

export default Feed;