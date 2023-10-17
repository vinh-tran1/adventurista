import React, { useEffect, useState } from "react";
import { View, Text, FlatList, SafeAreaView, Image, TextInput, TouchableOpacity, ScrollView, StyleSheet} from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Post from "../../Components/Post";

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
    title: 'Title 1',
    caption: 'Caption 1',
    img: 'https://images.squarespace-cdn.com/content/v1/57a370e9e58c6272ab5b8ec5/1626906851291-4C5JJ2DX37YWQ3TW0EC1/20210721_152538967_iOS.jpg'
  },
  {
    id: '2',
    title: 'Title 2',
    caption: 'Caption 2',
    img: 'https://dxbhsrqyrr690.cloudfront.net/sidearm.nextgen.sites/yalebulldogs.com/images/2022/1/28/SAM_5155.JPG'
  },
  {
    id: '3',
    title: 'Title 3',
    caption: 'Caption 3',
    img: 'https://csasquash.com/wp-content/uploads/02068_MTB_2022_MCSANTC_2022-02-19-1024x682.jpg'
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
        <Text>Location and Search Here</Text>
      </View>

       {/* rendering posts */}
      <FlatList
        data={DATA}
        renderItem={({ item }) => 
          <Post 
            title={item.title} 
            caption={item.caption} 
            img={item.img}
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
    marginVertical: 20,
    justifyContent: "center"
  },
  logo: {
    height: 60,
    width: 200,
  },
});

export default Feed;