import React, {useState, useEffect} from "react";
import axios from "axios";
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, processColor} from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import BubbleText from "../../Shared/BubbleText";
// Redux
import { useSelector, useDispatch } from 'react-redux';
import { selectUserInfo, setUserInfo } from "../../Redux/userSlice";

const UserTop = (props) => {

    const { createdByObj, userId, update, navigation } = props;
    const user = useSelector(selectUserInfo);
    const API_URL = process.env.REACT_APP_AWS_API_URL + 'users/' + userId;
    const API_URL_MUTUALS = process.env.REACT_APP_AWS_API_URL + 'users/friends/mutual/' + userId + '/' + user.userId;
    const [attendingUser, setAttendingUser] = useState("");
    const [mutuals, setMutuals] = useState([]);
    
    const handleViewProfile = () => {
        navigation.navigate('FriendProfileView', {poster: attendingUser });
    };

    useEffect(() => {
        axios.get(API_URL) 
        .then((response) => {
            setAttendingUser(response.data);
            // console.log("attending user: ", attendingUser.firstName)
        })
        .catch((error) => {
            console.log("fail to get user attending the event")
            console.log(error);
        });
        axios.get(API_URL_MUTUALS) 
        .then((response) => {
            setMutuals(response.data);
        })
        .catch((error) => {
            console.log("fail to get user mutuals")
            console.log(error);
        });
    }, [update])

    return (
        <ImageBackground source={{uri: attendingUser.profilePictureUrl}} style={styles.postTop}>
            <View style={styles.bottomContent}>
                <TouchableOpacity testID='view-profile-button' 
                    style={{ flexDirection: "row", alignItems: 'center', backgroundColor: '#4b3654', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10 }}
                    onPress={handleViewProfile}
                >
                    <View style={{ backgroundColor: "#D186FF", borderRadius: 20, borderWidth: 0.5, borderColor: 'white', width: 30, height: 30, marginRight: 4}}>
                        <FontAwesomeIcon style={{ marginLeft: 7.5, marginTop: 7.5 }} icon="user" size={15}/>
                    </View>
                    <Text style={{ color: "white", fontWeight: "bold", fontSize: 12, marginLeft: 2 }}>{mutuals.length} mutual friends</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: "row", marginTop: 10 }}>
                    {attendingUser?.interests?.length > 0 && attendingUser.interests.map((interest, index) => {
                        return (
                            <BubbleText key={index.toString()} title={interest} />
                        )
                    })}
                </View>
            </View>
        </ImageBackground>
    )
  };

  const styles = StyleSheet.create({
    postTop: {
        height: 456, 
    },
    locationContainer: {
        flexDirection: "row",
        backgroundColor: 'rgba(255, 255, 255, 0.80)',
        marginVertical: 5,
        padding: 5,
        borderRadius: 5,
        width: "55%"
    },
    bottomContent: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "flex-start",
        marginBottom: 20,
        marginHorizontal: 15,
    }
  });
  
  export default UserTop;