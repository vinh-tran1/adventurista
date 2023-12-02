import React, {useState, useEffect} from "react";
import axios from "axios";
import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import getAge from "../../Shared/GetAge";
// Redux
import { useSelector, useDispatch } from 'react-redux';
import { selectUserInfo, setUserInfo } from '../../Redux/userSlice';

const UserBottom = (props) => {

    const { userId, update, navigation } = props;
    const user = useSelector(selectUserInfo);
    const dispatch = useDispatch();
    const API_URL = process.env.REACT_APP_AWS_API_URL + 'users/' + userId;
    const [attendingUser, setAttendingUser] = useState(""); 
    const [age, setAge] = useState(0);
    const [groups, setGroups] = useState((attendingUser?.eventsGoingTo || []).filter(event => !(attendingUser?.eventsOwned || []).includes(event)));   // the friend's groups (not the user's)
    const [isFriend, setIsFriend] = useState(user.friends.some(friendId => friendId === userId)); 
    const [requested, setRequested] = useState(user.requests.outgoing.some(friendId => friendId === userId)); //poster's userId = userId

    useEffect(() => {
        axios.get(API_URL) 
        .then((response) => {
            setAttendingUser(response.data);
            setAge(getAge(attendingUser.age));
            // console.log("user attending info: ", attendingUser.firstName, age)
        })
        .catch((error) => {
            console.log("fail to get user attending info from the event")
            console.log(error);
        });
    }, [user.requests, update]);


    const handleAddFriend = async () => {
        try {
          const response = await axios.post(API_URL_ADD, {
            requesterId: user.userId, 
            requestId: userId
          });
    
          if (response.status == 200) {
            const updatedUser = response.data;
            // console.log(updatedUser);
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
        <View style={styles.postBottom}>
            <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                <View style={styles.topContainer}>
                    <Text style={{ fontSize: 24, fontWeight: "bold" }}>{attendingUser.firstName} {attendingUser.lastName}</Text>
                    <Text style={{ fontSize: 20, fontWeight: "bold", color: "#D99BFF", marginTop: 3, marginLeft: 6 }}>{age}</Text>
                </View>
               
                <View style={{ flexDirection: "row", marginTop: 12.5 }}>
                {!isFriend ? (
                    (requested) ? (
                        <View style={{ backgroundColor: '#B3B3B3', marginLeft: 6, paddingVertical: 4, paddingHorizontal: 6, borderRadius: 5, borderWidth: 2, borderColor: '#D186FF', justifyContent: 'center'}}>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: 'white'}}>pending</Text>
                        </View> )
                        : (
                        <TouchableOpacity testID="user-plus-icon" style={{ marginRight: 12.5 }} onPress={handleAddFriend}>
                            <FontAwesomeIcon color={"#717171"} icon="user-plus" size={25} />
                        </TouchableOpacity>
                        )
                    )
                    : (
                    <View style={{ backgroundColor: '#D186FF', marginLeft: 6, paddingVertical: 4, paddingHorizontal: 6, borderRadius: 5, borderWidth: 2, borderColor: '#EDDBFF', justifyContent: 'center'}}>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: 'white'}}>friends</Text>
                    </View>
                    )
                }
                </View>
                
                    {/* <TouchableOpacity style={{ marginTop: 3 }}>
                        <FontAwesomeIcon  color={"#717171"} icon="message" size={21} />
                    </TouchableOpacity> */}

                
            </View>
            <View>
                <Text style={{ fontWeight: "bold", fontSize: 12, color: "#717171" }}>{attendingUser?.friends?.length || "0"} friends, {groups?.length || "0"} groups</Text>
                <Text style={{ fontWeight: "bold", fontSize: 12, color: "#717171", marginTop: 2 }}>from {attendingUser.primaryLocation}</Text>
            </View>
        </View>
    )
  };

  const styles = StyleSheet.create({
    postBottom: {
        height: 112, 
        backgroundColor: '#fff',
        paddingVertical: 5,
        paddingHorizontal: 15
    },
    topContainer: {
        marginVertical: 7.5,
        flexDirection: "row",
    }
  });
  
  export default UserBottom;