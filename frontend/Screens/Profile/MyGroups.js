import { StyleSheet, View, Text, Image } from 'react-native';
import React, { useState, useEffect } from "react";
import axios from "axios";
// Redux
// import { useSelector, useDispatch } from 'react-redux';
// import { selectNewPost, setNewPost, selectUserInfo, setUserInfo } from '../../Redux/userSlice';

const MyGroups = ({ groupId, poster }) => {
  // have to use goingToEvents for now, because no groups yet
  const API_URL = process.env.REACT_APP_AWS_API_URL + 'events/event/' + groupId;
  // const user = useSelector(selectUserInfo);
  const [group, setGroup] = useState("");

  useEffect(() => {
    axios.get(API_URL) 
    .then((response) => {
        setGroup(response.data);
        // console.log(JSON.stringify(event, null, 2));
    })
    .catch((error) => {
        console.log(error);
        console.log("cannot get event going to")
    });
  }, [poster?.eventsGoingTo || []]);

  return (
    <View style={styles.container}>
        <Image source={{ uri: group.eventPictureUrl }} style={styles.circle} />
        <Text style={styles.caption} numberOfLines={2}>{group.title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
  },
  circle: {
    width: 70,
    height: 70,
    borderRadius: 70/2,
    marginTop: 10,
    marginBottom: 5,
    borderWidth: 3,
    borderColor: '#D99BFF'
  },
  caption: {
    fontSize: 10,
    fontWeight: '500',
    color: 'black',
    textAlign: 'center',
    width: 70
  }
});

export default MyGroups;
