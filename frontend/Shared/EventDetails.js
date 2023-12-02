import React, { useState } from "react";
import axios from "axios";
import { View, Text, Image, ImageBackground, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView} from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import AttendingUser from "./AttendingUser";
import { useSelector, useDispatch } from 'react-redux';
import { selectUserInfo, setUserInfo } from "../Redux/userSlice";

const EventDetails = ({ navigation, route }) => {

    const ATTEND_API_URL = process.env.REACT_APP_AWS_API_URL + 'events/going-to-event';
    const user = useSelector(selectUserInfo);
    const dispatch = useDispatch();
    const { event, poster, privacy } = route.params;
    const [isAttending, setIsAttending] = useState(user.eventsGoingTo.some(eventId => eventId === event.eventId));

    const handleViewProfile = () => {
        navigation.navigate('FriendProfileView', {poster: poster});
    };

    const handleAttendEvent = async () => {
        try {
            const response = await axios.post(ATTEND_API_URL, {
            userId: user.userId,
            eventId: event.eventId
          });
          if (response.status === 200) {
            const updatedUser = response.data;
            setIsAttending(true);
  
            dispatch(setUserInfo({
              newPost: false,
              ...updatedUser
            }));
  
            console.log("Successfully added event to your calendar");
          } else {
            console.log("Error adding this event to your calendar");
          }
        } catch (err) {
          console.log(err);
          console.log("An error occurred while adding this event to your calendar. Please try again.");
        }
      }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flexDirection: 'row', paddingHorizontal: 15, paddingBottom: 15, alignItems: 'center' }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <FontAwesomeIcon color={"black"} icon="caret-left" size={35} />
                </TouchableOpacity>

                <Text style={{ fontSize: 30, fontWeight: '700' }}>Event</Text>
            </View>
            
            <ImageBackground source={{uri: event.eventPictureUrl}} style={styles.postTop}>
                <View style={styles.postHeader}>
                    <Text style={{fontSize: 28, fontWeight: "bold"}}>{event.title}</Text>
                    <View style={styles.locationContainer}>
                        <FontAwesomeIcon style={{ marginRight: 5 }} color={"#D186FF"} icon="location-dot" size={15} />
                        <Text style={{ fontWeight: "bold", fontSize: 12 }}>{event.location}</Text>
                    </View>
                </View>
                <View style={styles.bottomContent}>
                    <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                        <TouchableOpacity 
                            onPress={handleViewProfile}
                            style={{ backgroundColor: '#4b3654', paddingVertical: 15, paddingHorizontal: 10, borderRadius: 10 }}>
                            <View style={{ flexDirection: "row"}}>
                                <View style={{ backgroundColor: "#D186FF", borderRadius: 20, borderWidth: 0.5, borderColor: 'white', width: 30, height: 30, marginRight: 2, marginBottom: 2}}>
                                    <FontAwesomeIcon style={{ marginLeft: 7.5, marginTop: 7.5 }} icon="user" size={15}/>
                                </View>
                                <Text style={{ color: "white", fontWeight: "700", marginTop: 7.5, marginLeft: 5 }}>by {poster.firstName}</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{ justifyContent: 'center', backgroundColor: '#4b3654', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10 }}>
                            <Text style={{ color: "white", fontWeight: "800", fontSize: 18 }}>{event.date}</Text>
                            <Text style={{ color: "white", fontWeight: "600", textAlign: "center", fontSize: 16, marginTop: 4 }}>{event.time}</Text>
                        </View>
                    </View>
                </View>
            </ImageBackground>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 20 }}>
                <Text style={styles.subheaderText}>Attending ({event.whoIsGoing.length})</Text>
                {!isAttending ? 
                <TouchableOpacity testID="attendButton" onPress={handleAttendEvent}>
                    <FontAwesomeIcon  color={'#4b3654'} icon="calendar-plus" size={25} />
                </TouchableOpacity>
                :
                <FontAwesomeIcon color={'#4b3654'} icon="check" size={35} />
                }
            </View>

            {(!privacy || isAttending) ?
            (<ScrollView>
            { event.whoIsGoing.length > 0 ?
                event.whoIsGoing.map((userId, index) => {
                return (
                    <AttendingUser key={index} userId={userId} ownerId={event.postingUserId} navigation={navigation}/>
                )
                })
                :
                <Text style={{ fontSize: 18, fontWeight: '700', color: 'gray' }}>
                    no users attending yet!
                </Text>
            }
            </ScrollView>)
            :
            (<View>
                <Text style={{ fontSize: 18,fontWeight: "600", marginVertical: 2, paddingHorizontal: 20, color: "gray"}}>
                    Join Event to See Details!
                </Text>
            </View>)

            }

        </SafeAreaView>
    )
  };

  const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    postTop: {
        height: 300, 
        backgroundColor: 'gray',
    },
    postHeader: {
        height: 90,
        backgroundColor: 'rgba(255, 255, 255, 0.65)',
        paddingVertical: 5,
        paddingHorizontal: 20,
    },
    locationContainer: {
        flexDirection: "row",
        backgroundColor: 'rgba(255, 255, 255, 0.80)',
        marginVertical: 5,
        padding: 5,
        borderRadius: 5,
        width: "75%"
    },
    bottomContent: {
        flex: 1,
        justifyContent: "flex-end",
        marginBottom: 15,
        marginHorizontal: 15,
    },
    subheaderText: {
        fontSize: 20,
        fontWeight: "bold",
        marginVertical: 15,
        paddingHorizontal: 20
    },
  });
  
  export default EventDetails;