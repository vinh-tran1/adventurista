import React from "react";
import { View, Text, Image, ImageBackground, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView} from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation } from '@react-navigation/native';
import AttendingUser from "./AttendingUser";

const EventDetails = (props) => {

    const { poster, event } = props;

    const navigation = useNavigation();

    // need logic for if they are friends or not -> use REDUX
    const handleViewProfile = () => {
        // navigation.navigate('FriendProfileView', {poster: createdByObj});
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={{ paddingHorizontal: 15, paddingBottom: 15 }} onPress={() => navigation.goBack()}>
                <FontAwesomeIcon color={"black"} icon="caret-left" size={35} />
            </TouchableOpacity>
            <ImageBackground source={{uri: "https://s.hdnux.com/photos/64/42/33/13772497/4/1200x0.jpg"}} style={styles.postTop}>
                <View style={styles.postHeader}>
                    <Text style={{fontSize: 28, fontWeight: "bold"}}>{event.title}</Text>
                    <View style={styles.locationContainer}>
                        <FontAwesomeIcon style={{ marginRight: 5 }} color={"#D186FF"} icon="location-dot" size={15} />
                        <Text style={{ fontWeight: "bold", fontSize: 12 }}>{event.location}</Text>
                    </View>
                </View>
                <View style={styles.bottomContent}>
                    <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                        <TouchableOpacity style={{ backgroundColor: '#4b3654', paddingVertical: 15, paddingHorizontal: 10, borderRadius: 10 }}>
                            <View style={{ flexDirection: "row"}}>
                                <View 
                                    style={{ backgroundColor: "#D186FF", borderRadius: 20, borderWidth: 0.5, borderColor: 'white', width: 30, height: 30, marginRight: 2, marginBottom: 2}}
                                    onPress={handleViewProfile}
                                >
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
            <Text style={styles.subheaderText}>Attending (5)</Text>
            <ScrollView>
                <AttendingUser />
                <AttendingUser />
                <AttendingUser /> 
                <AttendingUser /> 
                <AttendingUser />
            </ScrollView>
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