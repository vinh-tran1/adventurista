import React, {useState, useEffect} from "react";
import { View, Text, FlatList, SafeAreaView, Image, TextInput, TouchableOpacity, ScrollView, StyleSheet} from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import axios from "axios";
// Redux
import { useSelector, useDispatch } from 'react-redux';
import { selectUserInfo, setUserInfo } from "../../../Redux/userSlice";

const FollowRequest = ({ requesterId }) => {

  const API_URL_GET = process.env.REACT_APP_AWS_API_URL + 'users/' + requesterId;
  const API_URL_POST_ACCEPT = process.env.REACT_APP_AWS_API_URL + 'users/friend-request/accept';
  const API_URL_POST_DENY = process.env.REACT_APP_AWS_API_URL + 'users/friend-request/deny';
  const [requester, setRequester] = useState("");
  const profilePic = 'https://media.licdn.com/dms/image/C4D03AQGMfYOlb4UFaw/profile-displayphoto-shrink_800_800/0/1643655076107?e=2147483647&v=beta&t=v3YTetBWO8TOjEv-7hxNvsOdQWswiQT1DoGAJ7PNlDY';
  const user = useSelector(selectUserInfo);
  const dispatch = useDispatch();

  useEffect(() => {
    // console.log(user.firstName)
    axios.get(API_URL_GET) 
    .then((response) => {
        setRequester(response.data);
        // console.log(requester.firstName);
    })
    .catch((error) => {
        console.log(error);
    });

  }, [user, dispatch]);

  // console.log(requester.userId, requester.firstName);
  // console.log(user.userId, user.firstName)

  const handleAcceptFriend = async () => {
    try {
      const response = await axios.post(API_URL_POST_ACCEPT, {
        requesterId: requester.userId, 
        requestId: user.userId
      });

      if (response.status == 200) {
        const updatedUser = response.data;

        // redux to update friend status
        dispatch(setUserInfo({
          newPost: false,
          ...updatedUser
        }));

        console.log("Friend Request Accepted!")
        // console.log("updated user: " + updatedUser.requests.incoming);
      } else {
        console.log("Error in accepting friend request!");
      }

    } catch (err) {
      console.log(err);
      console.log("An error occured for accepting request. Please try again");
    }
  };

  const handleDenyFriend = async () => {
    try {
      const response = await axios.post(API_URL_POST_DENY, {
        requesterId: requester.userId, 
        requestId: user.userId
      });

      if (response.status == 200) {
        const updatedUser = response.data;

        // redux to update friend status
        dispatch(setUserInfo({
          newPost: false,
          ...updatedUser
        }));

        // console.log("updated user: " + user.requests.incoming);
        console.log("Friend Request sucessfully DENIED!")
      } else {
        console.log("Error in denying friend request!");
      }

      

    } catch (err) {
      console.log(err);
      console.log("An error occured for denying request. Please try again");
    }
  };

  return (
    <TouchableOpacity style={styles.request}>
        <View style={{ flexDirection: "row" }}>
            <Image source={{uri: profilePic}} style={styles.profilePic}/>
            <Text style={{ fontWeight: "bold", fontSize: 18, marginTop: 12.5, marginLeft: 12.5 }}>{requester.firstName} {requester.lastName}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
            <TouchableOpacity style={styles.button} onPress={handleAcceptFriend}>
                <FontAwesomeIcon style={{ marginLeft: 6, marginTop: 7 }} icon="fa-check" size={25} color="#D186FF"/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleDenyFriend}>
                <FontAwesomeIcon style={{ marginLeft: 6, marginTop: 7 }} icon="fa-xmark" size={25} />
            </TouchableOpacity>
        </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    flexDirection: "row",
    marginTop: 10,
    paddingHorizontal: 20
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 10,
    marginTop: 4
  },
  request: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    borderTopWidth: 0.5,
    paddingVertical: 12.5
  },
  profilePic: {
    height: 50,
    width: 50,
    borderRadius: 150/2,
    borderWidth: 2,
    borderColor: '#EDD3FF'
  },
  button: {
    height: 40, // Set a fixed height
    width: 40, // Set a fixed width
    borderRadius: 20, // Half of the height/width to make it a circle
    borderColor: "black",
    borderWidth: 0.5,
    marginHorizontal: 5
  }
});

export default FollowRequest;