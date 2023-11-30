import React, { useState, useEffect } from "react";
import { View, Text, Image, ImageBackground, StyleSheet, TouchableOpacity} from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
// Redux
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../Redux/userSlice';

const IndividualPost = ({ eventId }) => {

    const API_URL = process.env.REACT_APP_AWS_API_URL + 'events/event/' + eventId;
    const user = useSelector(selectUserInfo);
    const img = 'https://i.etsystatic.com/8606357/r/il/144257/2449311457/il_570xN.2449311457_3lz9.jpg';
    // const { title, location, img, date, time } = props;
    const navigation = useNavigation();
    const [event, setEvent] = useState("");

    useEffect(() => {
        axios.get(API_URL) 
        .then((response) => {
            setEvent(response.data);
        })
        .catch((error) => {
            console.log(error);
            console.log("cannot get event")
        });
    }, [user]);

    return (
        <TouchableOpacity testID='individual-post-component' onPress={() => navigation.navigate("Event Details")}>
            <ImageBackground source={{uri: img}} style={styles.postTop}>
                <View style={styles.postHeader}>
                    <Text style={{fontSize: 10, fontWeight: "700"}}>{event.title}</Text>
                    {/* <View style={styles.locationContainer}>
                        <FontAwesomeIcon style={{ marginRight: 2 }} color={"#D186FF"} icon="location-dot" size={5} />
                        <Text style={{ fontWeight: "600", fontSize: 5}}>{event.location}</Text>
                    </View> */}
                </View>
                <View style={styles.bottomContent}>
                    <View style={{ backgroundColor: '#4b3654', borderRadius: 2 }}>
                        <Text style={{ color: "white", fontWeight: "600", textAlign: "right", fontSize: 8 }}>{event.date}</Text>
                        <Text style={{ color: "white", fontWeight: "600", textAlign: "right", fontSize: 7 }}>{event.time}</Text>
                    </View>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    )
  };

  const styles = StyleSheet.create({
    postTop: {
        flex: 1,
        height: 127, 
        width: 121,
        backgroundColor: 'gray',
        marginBottom: 12,
    },
    postHeader: {
        height: 34,
        backgroundColor: 'rgba(255, 255, 255, 0.65)',
        paddingVertical: 4,
        paddingHorizontal: 10,
        justifyContent: 'center'
    },
    locationContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.80)',
        paddingVertical: 2,
        paddingHorizontal: 5,
        borderRadius: 5,
        width: '90%',
        height: 12,
    },
    bottomContent: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: 'flex-end',
        marginBottom: 20,
        marginHorizontal: 15,
    }
  });
  
  export default IndividualPost;
