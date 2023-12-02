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
  // dummy image before S3
  const img = 'https://i.etsystatic.com/8606357/r/il/144257/2449311457/il_570xN.2449311457_3lz9.jpg';

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
  }, [poster]);

  return (
    <View style={styles.container}>
        <Image source={{ uri: img }} style={styles.circle} />
        <Text style={styles.caption}>{group.title}</Text>
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
    marginBottom: 5,
    borderWidth: 2,
    borderColor: '#EDDBFF'
  },
  caption: {
    fontSize: 14,
    fontWeight: '500',
    color: 'gray'
  }
});

export default MyGroups;
