import React, {useState, useEffect} from "react";
import { View, Text, FlatList, SafeAreaView, Image, TextInput, TouchableOpacity, ScrollView, StyleSheet} from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
import { selectUserInfo, setUserInfo } from "../Redux/userSlice";

const AttendingUser = ({ userId, ownerId, navigation }) => {

  const API_URL = process.env.REACT_APP_AWS_API_URL + 'users/' + userId;
  const API_URL_ADD = process.env.REACT_APP_AWS_API_URL + 'users/friend-request';

  const user = useSelector(selectUserInfo);
  const dispatch = useDispatch();
  const [attendingUser, setAttendingUser]= useState("");
  const [isSamePerson, setIsSamePerson] = useState(user.userId === userId);
  const [isFriend, setIsFriend] = useState(user.friends.some(friendId => friendId === userId)); //poster's userId = userId
  const [requested, setRequested] = useState(user.requests.outgoing.some(friendId => friendId === userId)); //poster's userId = userId

  useEffect(() => {
    axios.get(API_URL)
      .then((response) => {
        setAttendingUser(response.data);
        // console.log("user attending event:", attendingUser);
      })
      .catch((error) => {
        console.log("user getting attending events failed")
        console.log(error);
      });
  }, [user]);

  const handleViewProfile = () => {
    navigation.navigate('FriendProfileView', {poster: attendingUser});
  };

  const handleAddFriend = async () => {
    try {
      const response = await axios.post(API_URL_ADD, {
        requesterId: user.userId, 
        requestId: userId
      });

      if (response.status == 200) {
        const updatedUser = response.data;
        console.log(updatedUser);
        setRequested(true);
        
        // redux to update friend status 
        dispatch(setUserInfo({
          newPost: false,
          ...updatedUser
        }));

        console.log("Sucessfully requested friend!")

      } else {
        console.log("Error in sending friend request!");
      }

    } catch (err) {
      console.log(err);
      console.log("An error occured for sending request. Please try again");
    }
  };

  return (
      <TouchableOpacity onPress={handleViewProfile} style={styles.request}>
          <View style={{ flexDirection: "row" }}>
              <Image source={{uri: attendingUser.profilePictureUrl}} style={styles.profilePic}/>
              <Text style={{ fontWeight: "bold", fontSize: 18, marginTop: 12.5, marginLeft: 12.5 }}>
                {attendingUser.firstName} {attendingUser.lastName} {user.userId === attendingUser.userId && "(me)"} {(attendingUser.userId === ownerId && attendingUser.userId !== user.userId) && "(owner)"}
              </Text>
          </View>
          {(!isSamePerson && !requested && !isFriend) &&
            <TouchableOpacity onPress={handleAddFriend} style={styles.button}>
              <FontAwesomeIcon testID='user-plus-icon' style={{ marginLeft: 10, marginTop: 10 }} icon="user-plus" size={20} color="#D186FF"/>
            </TouchableOpacity> 
          }
          {isFriend && 
            <View style={{ width: 70, backgroundColor: '#D186FF', marginLeft: 6, paddingVertical: 4, paddingHorizontal: 6, borderRadius: 5, borderWidth: 2, borderColor: '#EDDBFF', justifyContent: 'center'}}>
              <Text style={{ textAlign: 'center', fontSize: 14, fontWeight: '600', color: 'white'}}>friends</Text>
            </View>
          }
          {(!isSamePerson && requested) &&
            <View style={{ width: 70, backgroundColor: '#B3B3B3', marginLeft: 6, paddingVertical: 4, paddingHorizontal: 6, borderRadius: 5, borderWidth: 2, borderColor: '#D186FF', justifyContent: 'center'}}>
              <Text style={{ textAlign: 'center', fontSize: 14, fontWeight: '600', color: 'white'}}>pending</Text>
            </View>
          }
         
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
    borderTopWidth: 0.25,
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
    borderColor: "#D186FF",
    borderWidth: 0.5,
    marginHorizontal: 5
  }
});

export default AttendingUser;