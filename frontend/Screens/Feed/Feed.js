import React, { useEffect, useState } from "react";
import { View, Text, FlatList, SafeAreaView, Image, TextInput, TouchableOpacity, ScrollView, StyleSheet} from 'react-native';
import Post from "./Post";
import FeedFixedTop from "./FeedFixedTop";
import axios from 'axios';
// Redux
import { useSelector, useDispatch } from 'react-redux';
import { selectNewPost, setNewPost, selectUserInfo } from '../../Redux/userSlice';

const Feed = ({ navigation }) => {
  const user = useSelector(selectUserInfo);
  const API_URL = process.env.REACT_APP_AWS_API_URL + 'events/events/' + user.userId;
  const newPost = useSelector(selectNewPost);
  const dispatch = useDispatch();  

  const [posts, setPosts] = useState([]);

  // fetch posts api
  useEffect(() => {
    axios.get(API_URL)
    .then((response) => {
      setPosts(response.data);
      dispatch(setNewPost(false));
      // console.log(JSON.stringify(posts, null, 2))
    })
    .catch((error) => {
      console.log(error);
    });
  }, [newPost])

  return (
    <SafeAreaView style={styles.container}>
      <FeedFixedTop navigation={navigation} />
      <FlatList
        data={posts}
        initialNumToRender={8}
        maxToRenderPerBatch={4}
        renderItem={({ item }) => 
          <Post 
            date={item.date}
            location={item.location}
            img={item.eventPictureUrl}
            createdBy={item.postingUserId}
            time={item.time}
            caption={item.description}
            tags={item.tags}
            title={item.title}
            eventId={item.eventId}
            navigation={navigation}
          />}
        key={item => item.id}
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
