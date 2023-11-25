import React, { useEffect, useState } from "react";
import { View, Text, FlatList, SafeAreaView, Image, TextInput, TouchableOpacity, ScrollView, StyleSheet} from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Post from "./Post";
import FeedFixedTop from "./FeedFixedTop";
import axios from 'axios';
// Redux
import { useSelector, useDispatch } from 'react-redux';
import { selectNewPost, setNewPost } from '../../Redux/userSlice';

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

const Feed = ({ navigation }) => {
  // const user = useSelector(selectUserInfo);
  // const url = 'https://weaapwe0j9.execute-api.us-east-1.amazonaws.com/events/events'
  const API_URL = process.env.REACT_APP_AWS_API_URL + 'events/events'

  // useEffect(() => {
  //       axios
  //         .get(
  //           "https://drip-email-scraping-service-koh2hxfdwq-uw.a.run.app/closet",
  //           {
  //             params: { email: email },
  //           }
  //         )
  //         .then((response) => {
  //           setItems(response.data);
  //         })
  //         .catch((error) => {
  //           console.error(error);
  //         });
  //     }, []);

  const newPost = useSelector(selectNewPost);
  const dispatch = useDispatch();  

  const state = useSelector((state) => state);
  console.log(state);


  // fetch posts api
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    console.log("BEFORE: " + newPost)

    axios.get(API_URL)
    .then((response) => {
      setPosts(response.data);
      dispatch(setNewPost(false));

      console.log("AFTER: " + newPost);
    })
    .catch((error) => {
      console.log(error);
    });
  }, [newPost, dispatch])

  return (
    <SafeAreaView style={styles.container}>
      <FeedFixedTop navigation={navigation} />
      <FlatList
        data={posts}
        renderItem={({ item }) => 
          <Post 
            date={item.date}
            location={item.location}
            // img={'https://adventurista-event-picture-bucket.s3.amazonaws.com/' + item.eventPictureUrl}
            img={item.eventPictureUrl}
            createdBy={item.postingUserId}
            time={item.time}
            caption={item.description}
            tags={item.tags}
            title={item.title}
            eventId={item.eventId}
            //createdBy={item.createdBy}
          />}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
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
