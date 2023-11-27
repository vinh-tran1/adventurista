import React from "react";
import { View, Text, Image, ImageBackground, StyleSheet, TouchableOpacity} from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation } from '@react-navigation/native';

const IndividualPost = (props) => {

    const { title, location, img, date, time } = props;

    const navigation = useNavigation();

    return (
        <TouchableOpacity onPress={() => navigation.navigate("Event Details")}>
            <ImageBackground source={{uri: img}} style={styles.postTop}>
                <View style={styles.postHeader}>
                    <Text style={{fontSize: 12, fontWeight: "700"}}>{title}</Text>
                    <View style={styles.locationContainer}>
                        <FontAwesomeIcon style={{ marginRight: 2 }} color={"#D186FF"} icon="location-dot" size={5} />
                        <Text style={{ fontWeight: "600", fontSize: 5}}>{location}</Text>
                    </View>
                </View>
                <View style={styles.bottomContent}>
                    <Text style={{ color: "white", fontWeight: "600", textAlign: "right", fontSize: 12 }}>{date}</Text>
                    <Text style={{ color: "white", textAlign: "right", fontSize: 8 }}>{time}</Text>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    )
  };

  const styles = StyleSheet.create({
    postTop: {
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
        marginBottom: 20,
        marginHorizontal: 15,
    }
  });
  
  export default IndividualPost;
