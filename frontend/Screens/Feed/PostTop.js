import React from "react";
import { View, Text, Image, ImageBackground, StyleSheet} from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

const PostTop = (props) => {

    const { title, location, img, createdBy, date, time } = props;

    return (
        <ImageBackground source={{uri: img}} style={styles.postTop}>
            <View style={styles.postHeader}>
                <Text style={{fontSize: 28, fontWeight: "bold"}}>{title}</Text>
                <View style={styles.locationContainer}>
                    <FontAwesomeIcon style={{ marginRight: 5 }} color={"#D186FF"} icon="location-pin" size={15} />
                    <Text style={{ fontWeight: "bold", fontSize: 12 }}>{location}</Text>
                </View>
            </View>
            <View style={styles.bottomContent}>
                <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                    <View>
                        <View style={{ flexDirection: "row" }}>
                            <View style={{ backgroundColor: "#D186FF", borderRadius: 20, width: 30, height: 30 }}>
                                <FontAwesomeIcon style={{ marginLeft: 7.5, marginTop: 7.5 }} icon="user" size={15} />
                            </View>
                            <Text style={{ fontSize: 12, fontWeight: "bold", color: "white", marginLeft: 5, marginTop: 7.5 }}>+24</Text>
                        </View>
                        <Text style={{ color: "white", fontWeight: "bold" }}>by {createdBy}</Text>
                    </View>
                    <View style={{ marginTop: 7 }}>
                        <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>{date}</Text>
                        <Text style={{ color: "white", textAlign: "center", fontSize: 15 }}>{time}</Text>
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
        width: "55%"
    },
    bottomContent: {
        flex: 1,
        justifyContent: "flex-end",
        marginBottom: 20,
        marginHorizontal: 20,
    }
  });
  
  export default PostTop;