import React from "react";
import { View, Text, Image, ImageBackground, StyleSheet, TouchableOpacity} from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

const PostTop = (props) => {

    const { title, location, img, createdBy, createdByObj, date, time, attendance, navigation } = props;

    // need logic for if they are friends or not -> use REDUX
    const handleViewProfile = () => {
        navigation.navigate('FriendProfileView', {poster: createdByObj});
    };

    return (
        <ImageBackground source={{uri: img}} style={styles.postTop}>
            <View style={styles.postHeader}>
                <Text style={{fontSize: 28, fontWeight: "bold"}}>{title}</Text>
                <View style={styles.locationContainer}>
                    <FontAwesomeIcon style={{ marginRight: 5 }} color={"#D186FF"} icon="location-dot" size={15} />
                    <Text style={{ fontWeight: "bold", fontSize: 12 }}>{location}</Text>
                </View>
            </View>
            <View style={styles.bottomContent}>
                <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                    <View style={{ backgroundColor: '#4b3654', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10 }}>
                        <View style={{ flexDirection: "row"}}>
                            <TouchableOpacity 
                                testID="view-profile-button"
                                style={{ backgroundColor: "#D186FF", borderRadius: 20, borderWidth: 0.5, borderColor: 'white', width: 30, height: 30, marginRight: 2, marginBottom: 2}}
                                onPress={handleViewProfile}
                            >
                                <FontAwesomeIcon style={{ marginLeft: 7.5, marginTop: 7.5 }} icon="user" size={15}/>
                            </TouchableOpacity>
                            <Text style={{ fontSize: 12, fontWeight: "bold", color: "white", marginLeft: 5, marginTop: 7.5 }}>+{attendance} others</Text>
                        </View>
                        <Text style={{ color: "white", fontWeight: "700", marginTop: 2 }}>by {createdBy}</Text>
                    </View>
                    <View style={{ justifyContent: 'center', backgroundColor: '#4b3654', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10 }}>
                        <Text style={{ color: "white", fontWeight: "800", fontSize: 18 }}>{date}</Text>
                        <Text style={{ color: "white", fontWeight: "600", textAlign: "center", fontSize: 16, marginTop: 4 }}>{time}</Text>
                    </View>
                </View>
            </View>
        </ImageBackground>
    )
  };

  const styles = StyleSheet.create({
    postTop: {
        height: 456, 
        backgroundColor: 'gray',
    },
    postHeader: {
        height: 80,
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
        width: "100%"
    },
    bottomContent: {
        flex: 1,
        justifyContent: "flex-end",
        marginBottom: 15,
        marginHorizontal: 15,
    }
  });
  
  export default PostTop;